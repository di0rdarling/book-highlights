import { createHighlight, getHighlightById as getHighlight, getHighlights as getAllHighlights } from '../services/highlightsService';

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
 * Gets all highlights.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getHighlights(req, res) {
    getAllHighlights(req, res)
}