import mongoose, { Schema, Document } from 'mongoose';

export interface Highlight extends Document {
    bookTitle: string,
    bookId: string,
    text: string,
    note: string,
    highlightedDate: string,
}

export const HighlightSchema: Schema = new Schema({
    bookTitle: {
        type: String,
    },
    bookId: {
        type: String,
    },
    text: {
        type: String,
    },
    note: {
        type: String,
    },
    highlightedDate: {
        type: Date
    }
});

export default mongoose.model<Highlight>('Highlight', HighlightSchema)
