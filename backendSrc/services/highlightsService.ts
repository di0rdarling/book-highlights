import { StatusCodes } from 'http-status-codes';
import { cannotFetchHighlights, highlightNotFound, missingHighlightFieldsMessage, errorCreatingHighlight, errorSyncingReadwiseHighlights } from '../messages/errorMessage';
import { Highlight as HighlightFull } from '../models/highlight';
import Highlight from '../models/schemas/highlight';
import { validateHighlightCreate } from '../validators/highlightsValidator';
import axios from 'axios';
import { READWISE_AUTH_TOKEN, READWISE_LIST_HIGHLIGHTS_PAGE_SIZE, READWISE_LIST_HIGHLIGHTS_URL, READWISE_LIST_BOOKS_URL, READWISE_LIST_BOOKS_PAGE_SIZE } from '../config/config';
import { mapReadwiseHighlightsToHighlights } from '../mappers/readwiseMapper';
import { highlightDeleted, allHighlightsDeleted } from '../messages/generalMessages';

/**
 * Creates a highlight.
 * @param req http request.
 * @param resp https 
 */
export async function createHighlight(req, resp) {

    let highlight = req.body as HighlightFull;
    let missingFields = validateHighlightCreate(highlight);
    if (missingFields.length > 0) {
        resp.status(StatusCodes.BAD_REQUEST).send(missingHighlightFieldsMessage(missingFields))
    } else {
        highlight.highlightedDate = new Date();
        highlight.viewed = false;
        try {
            let highlight = await new Highlight(req.body);
            highlight.save((err, highlight) => {
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
export async function getHighlightById(req, resp) {
    await Highlight.findById(req.params._id).then(highlight => {
        if (!highlight) {
            resp.status(StatusCodes.NOT_FOUND).send(highlightNotFound)
        } else {
            resp.status(StatusCodes.OK).send(highlight)
        }
    }).catch(err => {
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(cannotFetchHighlights)
    })
}

/**
 * Gets all highlights.
 * @param req http request.
 * @param resp http response.
 */
export async function getHighlights(req, resp) {
    await Highlight.find({}).then((highlights) => {
        resp.status(StatusCodes.OK).send(highlights)
    }).catch((err) => {
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(cannotFetchHighlights)
    });
}

/**
 * Deletes a highlight by id.
 * @param req http request.
 * @param resp http response.
 */
export async function deleteHighlight(req, resp) {
    await Highlight.findByIdAndDelete(req.params._id).then(highlight => {
        resp.status(StatusCodes.OK).send(highlightDeleted)
    }).catch(err => {
        resp.status(StatusCodes.NOT_FOUND).send(highlightNotFound)
    })
}

/**
 * Deletes a highlight by id.
 * @param req http request.
 * @param resp http response.
 */
export async function deleteAllHighlights(req, resp) {
    await Highlight.deleteMany({}).then(highlight => {
        resp.status(StatusCodes.OK).send(allHighlightsDeleted)
    }).catch(err => {
        resp.status(StatusCodes.NOT_FOUND).send(highlightNotFound)
    })
}

/**
 * Gets all readwise highlights.
 * @param req http request.
 * @param resp http response.
 */
export async function syncReadwiseHighlights(req, resp) {

    let readwiseGetHighlightsUrl = `${READWISE_LIST_HIGHLIGHTS_URL}?page=1&page_size=${READWISE_LIST_HIGHLIGHTS_PAGE_SIZE}`
    let readwiseHighlights = []

    //Get the all the highlights on readwise.
    while (readwiseGetHighlightsUrl) {
        let response = await axios({
            method: 'GET',
            url: readwiseGetHighlightsUrl,
            headers: {
                'Authorization': `Token ${READWISE_AUTH_TOKEN}`
            }
        });
        if (response.status === 200) {
            let results = response.data.results
            readwiseHighlights = readwiseHighlights.concat(results);
            if (response.data.next) {
                readwiseGetHighlightsUrl = response.data.next;
            } else {
                readwiseGetHighlightsUrl = null;
            }
        } else {
            readwiseGetHighlightsUrl = null;
        }
    }

    if (readwiseHighlights.length > 0) {
        let readwiseGetBooksUrl = `${READWISE_LIST_BOOKS_URL}?page=1&page_size=${READWISE_LIST_BOOKS_PAGE_SIZE}`
        let readwiseBooks = []

        //Get all the books on readwise.
        while (readwiseGetBooksUrl) {
            let response = await axios({
                method: 'GET',
                url: readwiseGetBooksUrl,
                headers: {
                    'Authorization': `Token ${READWISE_AUTH_TOKEN}`
                }
            });
            if (response.status === 200) {
                let results = response.data.results
                readwiseBooks = readwiseBooks.concat(results);
                if (response.data.next) {
                    readwiseGetBooksUrl = response.data.next;
                } else {
                    readwiseGetBooksUrl = null;
                }
            } else {
                readwiseGetBooksUrl = null;
            }
        }

        //Map each highlight and corresponding book to a full highlight model.
        let mappedHighlights = mapReadwiseHighlightsToHighlights(readwiseHighlights, readwiseBooks);

        await Highlight.insertMany(mappedHighlights).then(highlights => {
            resp.status(StatusCodes.OK).send(highlights)
        }).catch(err => {
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorSyncingReadwiseHighlights)
        })
    } else {
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Unable to sync highlights") //TODO: ERROR HANDLE PROPERLY.
    }
}
