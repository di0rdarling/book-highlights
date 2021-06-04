import { Schema, Document, model } from 'mongoose';
import { Highlight as HighlightModel } from '../highlight';
import Connection from '../../database/connection';

new Connection();

export interface Highlight extends Omit<HighlightModel, '_id'>, Document { }

export const HighlightSchema: Schema = new Schema({
    bookTitle: {
        type: String,
        required: true,
        validate(value: string) {
            if (value === undefined) throw new Error("A highlight must contain a book title.");
        },
    },
    authors: {
        type: Array,
    },
    coverImageUrl: {
        type: String,
    },
    bookId: {
        type: Number,
    },
    text: {
        type: String,
        required: true,
        validate(value: string) {
            if (value === undefined) throw new Error("A highlight must contain a a text string.");
        },
    },
    highlightedDate: {
        type: String,
    },
    viewed: {
        type: Boolean
    },
    favourited: {
        type: Boolean
    }
}, {
    versionKey: false
});

export default model<Highlight>("Highlight", HighlightSchema)
