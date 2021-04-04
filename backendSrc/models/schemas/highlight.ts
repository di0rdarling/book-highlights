import { Schema, Document } from 'mongoose';
import { MongoDbConnection } from '../../database/mongoDbConnection';
import { Highlight as HighlightModel } from '../highlight';


export interface Highlight extends Omit<HighlightModel, '_id'>, Document { }

export const HighlightSchema: Schema = new Schema({
    bookTitle: {
        type: String,
        required: true,
        validate(value) {
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
        validate(value) {
            if (value === undefined) throw new Error("A highlight must contain a a text string.");
        },
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
}, {
    versionKey: false
});

export default new MongoDbConnection().connection.model('Highlight', HighlightSchema)