import mongoose, { Schema, Document } from 'mongoose';
import { HighlightCreate } from './highlightCreate';

export interface Highlight extends Document, HighlightCreate {
    _id: string,
}

export const HighlightSchema: Schema = new Schema({
    _id: {
        type: String
    },
    bookTitle: {
        type: String,
    },
    bookId: {
        type: String,
    },
    text: {
        type: String,
        required: true,
        validate(value) {
            if (value === undefined || value.length < 1) throw new Error("A highlight must contain a a text string.");
        },
    },
    note: {
        type: String,
    },
    highlightedDate: {
        type: Date
    }
});

export default mongoose.model<Highlight>('Highlight', HighlightSchema)
