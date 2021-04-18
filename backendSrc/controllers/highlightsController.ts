import { createHighlight, getHighlightById as getHighlight, getHighlights as getAllHighlights, syncReadwiseHighlights as syncAllReadwiseHighlights, deleteHighlight, deleteAllHighlights, sendHighlights as sendRandomHighlights } from '../services/highlightsService';


/**
 * Posts a highlight.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function postHighlight(req, res) {
    createHighlight(req, res)
}

/**
 * Gets the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getHighlightById(req, res) {
    getHighlight(req, res)
}

/**
 * Syncs all readwise highlights.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function syncReadwiseHighlights(req, res) {
    syncAllReadwiseHighlights(req, res)
}

/**
 * Gets all highlights.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getHighlights(req, res) {
    getAllHighlights(req, res)
}

/**
 * Deletes the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function deleteHighlights(req, res) {
    deleteAllHighlights(req, res)
}

/**
 * Deletes the highlight with the matching ID.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function deleteHighlightById(req, res) {
    deleteHighlight(req, res)
}

/**
 * Sends random highlights to the email in the config.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function sendHighlights(req, res) {
    sendRandomHighlights(req, res)
}