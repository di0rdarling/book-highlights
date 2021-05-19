import { Highlight } from "../models/highlight";

/**
 * Maps the given readwise highlights and books to a full highlight object.
 * @param readwiseHighlights readwise highlight
 * @param readwiseBooks readwise books
 */
export function mapReadwiseHighlightsToHighlights(readwiseHighlight: any[], readwiseBooks: any[]): Highlight[] {
    let mappedHighlights: Highlight[] = [];
    readwiseHighlight.map(readwiseHighlight => {
        mappedHighlights.push(mapReadwiseHighlightToHighlight(readwiseHighlight, readwiseBooks))
    })
    return mappedHighlights;
}

/**
 * Maps the given readwise highlights to full highlight model objects.
 * @param readwiseHighlight readwise highlight.
 * @param readwiseBooks readwise books.
 */
export function mapReadwiseHighlightToHighlight(readwiseHighlight: any, readwiseBooks: any[]): Highlight {

    let book = readwiseBooks.find(book => book.id === readwiseHighlight.book_id);
    let bookTitle = book && book.title
    let bookAuthors = book && book.author.split(',');
    let coverImageUrl = book && book.cover_image_url;

    let highlight: Highlight = {
        _id: null,
        text: readwiseHighlight.text,
        highlightedDate: readwiseHighlight.highlighted_at || new Date(),
        bookId: readwiseHighlight.book_id,
        bookTitle: bookTitle,
        authors: bookAuthors,
        coverImageUrl: coverImageUrl,
        viewed: false,
        favourited: false,
    }

    return highlight;
}