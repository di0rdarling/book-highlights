import { createHighlight, editHighlightById as editHighlight, getHighlightById as getHighlight, getHighlights as getAllHighlights, syncReadwiseHighlights as syncAllReadwiseHighlights, deleteHighlight, deleteAllHighlights, sendHighlights as sendRandomHighlights } from '../services/highlightsService';
import logger from '../logging/logger'
/**
 * Posts a highlight.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function postHighlight(req: any, res: any) {
    logger.info('server.highlights.post.called')
    createHighlight(req, res)
}

/**
 * Gets the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getHighlightById(req: any, res: any) {
    logger.info('server.highlights.get.id.called')
    getHighlight(req, res)
}

/**
 * Edits the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function editHighlightById(req: any, res: any) {
    logger.info('server.highlights.put.id.called')
    editHighlight(req, res)
}

/**
 * Syncs all readwise highlights.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function syncReadwiseHighlights(req: any, res: any) {
    logger.info('server.highlights.sync.called')
    syncAllReadwiseHighlights(req, res)
}

/**
 * Gets all highlights.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getHighlights(req: any, res: any) {
    logger.info('server.highlights.get.called')
    getAllHighlights(req, res)
}

/**
 * Deletes the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function deleteHighlights(req: any, res: any) {
    logger.info('server.highlights.delete.called')
    deleteAllHighlights(req, res)
}

/**
 * Deletes the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function deleteHighlightById(req: any, res: any) {
    logger.info('server.highlights.delete.id.called')
    deleteHighlight(req, res)
}

/**
 * Sends random highlights to the email in the config.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function sendHighlights(req: any, res: any) {
    logger.info('server.highlights.email.called')
    sendRandomHighlights(req, res)
}