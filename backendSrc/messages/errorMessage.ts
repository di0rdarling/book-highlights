/**
 * Returns the error message for the given missing fields.
 * @param missingFields missing fields.
 * @returns error message for the given missing fields.
 */
export function missingFieldsMessage(missingFields: string[]): string {
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

export const errorCreatingObject = (object: string) => `Unable to create ${object}.`

export const errorSyncingReadwiseHighlights = "Unable to sync Readwise highlight."

export const invalidUserPasswordLength = (length: number) => `User password must be ${length} characters or more.`

export const invalidUserPasswordContent = `User password must have at least one uppercase letter and one number.`

export const invalidUserEmail = `User email must be a valid email address.`