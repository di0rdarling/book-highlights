import { createHighlight, editHighlightById as editHighlight, getHighlightById as getHighlight, getHighlights as getAllHighlights, syncReadwiseHighlights as syncAllReadwiseHighlights, deleteHighlight, deleteAllHighlights, sendHighlights as sendRandomHighlights } from '../services/highlightsService';
import logger from '../logging/logger'
/**
 * Posts a highlight.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function postHighlight(req: any, res: any) {
    createHighlight(req, res)
}

/**
 * Gets the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getHighlightById(req: any, res: any) {
    getHighlight(req, res)
}

/**
 * Edits the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function editHighlightById(req: any, res: any) {
    editHighlight(req, res)
}

/**
 * Syncs all readwise highlights.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function syncReadwiseHighlights(req: any, res: any) {
    syncAllReadwiseHighlights(req, res)
}

/**
 * Gets all highlights.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getHighlights(req: any, res: any) {
    logger.info('server.highlights.get.all.called')
    getAllHighlights(req, res)
}

/**
 * Deletes the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function deleteHighlights(req: any, res: any) {
    deleteAllHighlights(req, res)
}

/**
 * Deletes the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function deleteHighlightById(req: any, res: any) {
    deleteHighlight(req, res)
}

/**
 * Sends random highlights to the email in the config.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function sendHighlights(req: any, res: any) {
    sendRandomHighlights(req, res)
}