import mongoose, { Schema, Document } from 'mongoose';

export interface Highlight extends Document {
    bookTitle: string,
    bookId?: string,
    text: string,
    note?: string,
    highlightedDate: Date,
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
        required: true,
        validate(value) {
            if (value === undefined) throw new Error("A highlight must contain a a text string.");
        },
    },
    note: {
        type: String,
    },
    highlightedDate: {
        type: Date
    },
    viewed: {
        type: Boolean
    },
    favourited: {
        type: Boolean
    }
});

export default mongoose.model<Highlight>('Highlight', HighlightSchema)
