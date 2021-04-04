import { StatusCodes } from 'http-status-codes';
import { highlightNotFound, missingHighlightFieldsMessage } from '../errorMessage';
import { Highlight as HighlightFull } from '../models/highlight';
import Highlight from '../models/schemas/highlight';
import { validateHighlightCreate } from '../validators/highlightsValidator';

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
            highlight.save((err, doc) => {
                if (err) {
                    resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error creating highlight.")
                } else {
                    resp.status(StatusCodes.CREATED).send(doc)
                }
            });
        } catch (e) {
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error creating highlight.")
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
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Unable to fetch highlight.")
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
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Unable to fetch highlights.")
    });
}
