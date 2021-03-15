import mongoose, { Schema, Document } from 'mongoose';
import { HighlightSchema, Highlight } from './highlight';
import { Flag } from './enums/flag';
import { Note } from './note';

export interface Entity extends Document {
    highlight: Highlight,
    description: string,
    flag: Flag,
    note: Note[]
}

const EntitySchema: Schema = new Schema({
    highlight: {
        type: HighlightSchema,
        required: true,
        validate(value) {
            if (value === undefined) throw new Error("An entity must contain a highlight.");
        },
    },
    description: {
        type: String,
    },
    flag: {
        type: String,
        enum: Flag
    },
    note: {
        type: Array,
        validate(value) {
            if (value.length === 0) throw new Error("An entity must contain at least one note.");
        },
    }
});

export default mongoose.model<Entity>('Entity', EntitySchema)