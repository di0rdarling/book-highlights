/**
 * Returns the error message for the given missing highlight fields.
 * @param missingFields missing high fields.
 * @returns error message for the given missing fields.
 */
export function missingHighlightFieldsMessage(missingFields: string[]): string {
    let errorMessage = 'The following fields are required: ';

    for (let i = 0; i < missingFields.length; i++) {
        errorMessage += missingFields[i];
        if (i !== missingFields.length - 1) {
            errorMessage += ', '
        }
    }
    return errorMessage;
}

export const highlightNotFound = "A highlight with the given Id does not exist."

export const cannotFetchHighlights = "Unable to fetch highlights."

export const cannotMailHighlights = "Unable to mail highlights."

export const cannotFetchHighlight = "Unable to fetch highlight."

export const errorCreatingHighlight = "Unable to fetch highlight."

export const errorSyncingReadwiseHighlights = "Unable to sync Readwise highlight."