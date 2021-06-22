import { HighlightCreate } from "../models/highlights/highlightCreate";

/**
 * Validate a given highlight create object.
 * @param highlightCreate highlight create object.
 * @returns an array containing the invalid fields, if there are any present
 */
export function validateHighlightCreate(highlightCreate: HighlightCreate) {
    let invalidFields = [];
    if (!highlightCreate.text) {
        invalidFields.push('text')
    }
    if (!highlightCreate.bookTitle) {
        invalidFields.push('bookTitle')
    }
    if (highlightCreate.favourited === undefined) {
        invalidFields.push('favourited')
    }

    return invalidFields;
}