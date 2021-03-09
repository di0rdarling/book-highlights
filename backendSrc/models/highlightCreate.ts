import mongoose, { Schema, Document } from 'mongoose';

export interface HighlightCreate extends Document {
    bookTitle: string,
    bookId?: string,
    text: string,
    note?: string,
    highlightedDate: string,
}

export const HighlightCreateSchema: Schema = new Schema({
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

export default mongoose.model<HighlightCreate>('Highlight', HighlightCreateSchema)
