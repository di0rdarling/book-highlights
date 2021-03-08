import mongoose, { Schema, Document } from 'mongoose';
import { HighlightSchema, Highlight } from './highlight';
import { Flag } from './enums/flag';

export interface Entity extends Document {
    highlights: Highlight[],
    description: string,
    flag: Flag,
    note: string
}

const EntitySchema: Schema = new Schema({
    highlight: {
        type: [HighlightSchema],
        required: true,
        validate(value) {
            if (value === undefined) throw new Error("An entity must contain at least one highlight.");
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
        type: String,
    },
});

export default mongoose.model<Entity>('Entity', EntitySchema)