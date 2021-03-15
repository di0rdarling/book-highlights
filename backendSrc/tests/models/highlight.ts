export interface HighlightCreate {
    bookTitle: string,
    bookId?: string,
    text: string,
    note?: string,
    highlightedDate: Date,
    viewed: boolean,
    favourited: boolean
}

export interface Highlight extends Omit<HighlightCreate, 'highlightedDate'> {
    _id?: string,
    __v?: number,
    highlightedDate: Date
}