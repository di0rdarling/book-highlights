export interface Highlight {
    _id: string
    highlightedDate: Date,
    viewed: boolean,
    bookId?: number,
    text: string,
    bookTitle: string,
    authors?: string[],
    coverImageUrl?: string,
    favourited: boolean,
}