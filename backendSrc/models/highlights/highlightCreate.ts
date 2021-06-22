export interface HighlightCreate {
    bookId?: number,
    text: string,
    bookTitle: string,
    authors?: string[],
    coverImageUrl?: string,
    favourited: boolean,
}