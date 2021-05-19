import nodemailer from 'nodemailer';
import Highlight from '../models/schemas/highlightSchema';
import { StatusCodes } from 'http-status-codes';
import { cannotFetchHighlights, highlightNotFound, missingHighlightFieldsMessage, errorCreatingHighlight, errorSyncingReadwiseHighlights, cannotMailHighlights } from '../messages/errorMessage';
import { Highlight as HighlightFull } from '../models/highlight';
import { validateHighlightCreate } from '../validators/highlightsValidator';
import { mapReadwiseHighlightsToHighlights } from '../mappers/readwiseMapper';
import { highlightDeleted, allHighlightsDeleted } from '../messages/generalMessages';
import { getHighlights as getReadwiseHighlights, getBooks as getReadwiseBooks } from '../services/readwiseService';
import { connect } from 'mongoose';
import logger from '../logging/logger';
import MongoDbConnection from '../database/mongoDbConnection';

let connection = new MongoDbConnection();
console.log(connection.useConnection().readyState)

async function openMongodbConnection() {
    await connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}


/**
 * Creates a highlight.
 * @param req http request.
 * @param resp https 
 */
export async function createHighlight(req: any, resp: any) {

    let highlight = req.body as HighlightFull;
    let missingFields = validateHighlightCreate(highlight);
    if (missingFields.length > 0) {
        resp.status(StatusCodes.BAD_REQUEST).send(missingHighlightFieldsMessage(missingFields))
    } else {
        highlight.highlightedDate = new Date();
        highlight.viewed = false;
        try {
            openMongodbConnection()
            let highlight = await new Highlight(req.body);
            highlight.save((err: any, highlight: any) => {
                if (err) {
                    resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorCreatingHighlight)
                } else {
                    resp.status(StatusCodes.CREATED).send(highlight)
                }
            });
        } catch (e) {
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorCreatingHighlight)
        }
    }
}

/**
 * Gets a highlight by id.
 * @param req http request.
 * @param resp http response.
 */
export async function getHighlightById(req: any, resp: any) {
    openMongodbConnection()
    await Highlight.findById(req.params._id).then((highlight: any) => {
        if (!highlight) {
            resp.status(StatusCodes.NOT_FOUND).send(highlightNotFound)
        } else {
            resp.status(StatusCodes.OK).send(highlight)
        }
    }).catch((err: Error) => {
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(cannotFetchHighlights)
    })
}

/**
 * Edits a highlight by id.
 * @param req http request.
 * @param resp http response.
 */
export async function editHighlightById(req: any, resp: any) {
    openMongodbConnection()
    await Highlight.findByIdAndUpdate(req.params._id, req.body, { new: true }).then((highlight: any) => {
        if (!highlight) {
            resp.status(StatusCodes.NOT_FOUND).send(highlightNotFound)
        } else {
            resp.status(StatusCodes.OK).send(highlight)
        }
    }).catch((err: Error) => {
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(cannotFetchHighlights)
    })
}

/**
 * Gets all highlights.
 * @param req http request.
 * @param resp http response.
 */
export async function getHighlights(req: any, resp: any) {
    // openMongodbConnection()
    await Highlight.find({}).then((highlights: any) => {
        resp.status(StatusCodes.OK).send(highlights)
        logger.info('server.highlights.get.all.success')
    }).catch((err: Error) => {
        logger.error(err.message)
        logger.error('server.highlights.get.all.fail')
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(cannotFetchHighlights)
    });
}

/**
 * Deletes a highlight by id.
 * @param req http request.
 * @param resp http response.
 */
export async function deleteHighlight(req: any, resp: any) {
    openMongodbConnection()
    await Highlight.findByIdAndDelete(req.params._id).then((highlight: any) => {
        resp.status(StatusCodes.OK).send(highlightDeleted)
    }).catch((err: Error) => {
        resp.status(StatusCodes.NOT_FOUND).send(highlightNotFound)
    })
}

/**
 * Deletes a highlight by id.
 * @param req http request.
 * @param resp http response.
 */
export async function deleteAllHighlights(req: any, resp: any) {

    openMongodbConnection()
    await Highlight.deleteMany({}).then((highlight: any) => {
        resp.status(StatusCodes.OK).send(allHighlightsDeleted)
    }).catch((err: Error) => {
        resp.status(StatusCodes.NOT_FOUND).send(highlightNotFound)
    })
}

/**
 * Gets all readwise highlights.
 * @param req http request.
 * @param resp http response.
 */
export async function syncReadwiseHighlights(req: any, resp: any) {

    try {
        let readwiseHighlights = await getReadwiseHighlights(true)
        let readwiseBooks = await getReadwiseBooks(true);

        if (readwiseHighlights && readwiseBooks && readwiseHighlights.length && readwiseBooks.length) {
            //Map each highlight and corresponding book to a full highlight model.
            let mappedHighlights = mapReadwiseHighlightsToHighlights(readwiseHighlights, readwiseBooks);

            //Remove any highlights that already exist in the database.
            await Highlight.find({}).then(async (highlights: any[]) => {

                //This algorithm assumes that each highlight text will be unique.
                let existingHighlightsText = highlights.map((h: HighlightFull) => h.text);

                let acceptedNewHighlights = mappedHighlights.filter(highlight => {
                    if (!existingHighlightsText.includes(highlight.text)) {
                        return highlight;
                    }
                })

                if (acceptedNewHighlights.length > 1) {
                    openMongodbConnection()
                    await Highlight.insertMany(acceptedNewHighlights).then((highlights: any[]) => {
                        resp.status(StatusCodes.OK).send(highlights)
                    }).catch((err: Error) => {
                        throw new Error('Unable to get update highlights database.')
                    })
                } else {
                    resp.status(StatusCodes.OK).send("All highlights synced and up to date.")
                }
            }).catch((err: Error) => {
                throw new Error('Unable to get existing highlights from database.')
            });
        } else {
            if (!readwiseHighlights) {
                console.log(`"readwiseHighlights" is undefined`)
            } else {
                console.log(`"readwiseBooks" is undefined`)
            }
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorSyncingReadwiseHighlights)
        }
    } catch (err) {
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorSyncingReadwiseHighlights)
    }
}

/**
 * Gets all highlights.
 * @param req http request.
 * @param resp http response.
 */
export async function sendHighlights(req: any, resp: any) {
    openMongodbConnection()

    await Highlight.find({}).then(async (highlights: any[]) => {

        let randomHighlights = [];

        while (randomHighlights.length < 5) {
            let randomIndex = Math.floor(Math.random() * highlights.length);
            randomHighlights.push(highlights[randomIndex]);
            highlights.splice(randomIndex, 1);
        }

        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: 'helenfagbemi@gmail.com',
                pass: 'Passes30316',
            },
            logger: true
        });


        // // send mail with defined transport object
        // await transporter.sendMail({
        //     from: '"BrainSpace 🧠" <helenfagbemi@gmail.com>', // sender address
        //     to: "helenfagbemi@gmail.com, h.fagbemi@yahoo.co.uk", // list of receivers
        //     subject: "BrainSpace Highlights", // Subject line
        //     html: `

        //     <div>
        //     <div style='display:flex'>
        //       <h3>${randomHighlights[0].bookTitle}</h3>
        //       <p  style='margin-top: 20px; margin-left: 8px;'>
        //         by ${randomHighlights[0].authors[0]}
        //     </p>
        //     </div>
        //     <div style='height:2px;width:100%; background-color:black;margin-top:-10px; margin-bottom:8px; display:block'> </div>
        //     <p>
        //     ${randomHighlights[0].text}
        //     </p>
        //     <div/> 

        //     <div>
        //     <div style='display:flex'>
        //       <h3>${randomHighlights[1].bookTitle}</h3>
        //       <p  style='margin-top: 20px; margin-left: 8px;'>
        //         by ${randomHighlights[1].authors[0]}
        //     </p>
        //     </div>
        //     <div style='height:2px;width:100%; background-color:black;margin-top:-10px; margin-bottom:8px; display:block'> </div>
        //     <p>
        //     ${randomHighlights[1].text}
        //     </p>
        //     <div/> 

        //     <div>
        //     <div style='display:flex'>
        //       <h3>${randomHighlights[2].bookTitle}</h3>
        //       <p  style='margin-top: 20px; margin-left: 8px;'>
        //         by ${randomHighlights[2].authors[0]}
        //     </p>
        //     </div>
        //     <div style='height:2px;width:100%; background-color:black;margin-top:-10px; margin-bottom:8px; display:block'> </div>
        //     <p>
        //     ${randomHighlights[2].text}
        //     </p>
        //     <div/> 

        //     <div>
        //     <div style='display:flex'>
        //       <h3>${randomHighlights[3].bookTitle}</h3>
        //       <p  style='margin-top: 20px; margin-left: 8px;'>
        //         by ${randomHighlights[3].authors[0]}
        //     </p>
        //     </div>
        //     <div style='height:2px;width:100%; background-color:black;margin-top:-10px; margin-bottom:8px; display:block'> </div>
        //     <p>
        //     ${randomHighlights[3].text}
        //     </p>
        //     <div/> 

        //     <div>
        //     <div style='display:flex'>
        //       <h3>${randomHighlights[4].bookTitle}</h3>
        //       <p  style='margin-top: 20px; margin-left: 8px;'>
        //         by ${randomHighlights[4].authors[0]}
        //     </p>
        //     </div>
        //     <div style='height:2px;width:100%; background-color:black;margin-top:-10px; margin-bottom:8px; display:block'> </div>
        //     <p>
        //     ${randomHighlights[4].text}
        //     </p>
        //     <div/> 
        //     `,
        // }, (err, response) => {
        //     if (err) {
        //         resp.status(500).send('Unable to send email.')
        //     } else {
        //         resp.status(200).send('Email sent.')
        //     }
        // });

    }).catch((err: Error) => {
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(cannotMailHighlights)
    });
}
