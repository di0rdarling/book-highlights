import mongoose, { Schema, Document } from 'mongoose';
import { HighlightSchema, Highlight } from './highlight';
import { Flag } from './enums/flag';
import { EntityCreate } from './entityCreate';

export interface Entity extends Document, EntityCreate {
    _id: string,
}

const EntitySchema: Schema = new Schema({
    _id: {
        type: String,
    },
    highlights: {
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
    }
});

export default mongoose.model<Entity>('Entity', EntitySchema)