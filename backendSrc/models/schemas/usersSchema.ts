import { Schema, Document, model } from 'mongoose';
import { User as UserModel } from '../users/user';
import Connection from '../../database/connection';

new Connection();

export interface User extends Omit<UserModel, '_id'>, Document { }

export const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true,
        validate(value: string) {
            if (value === undefined) throw new Error("A first name must be set.");
        },
    },
    lastName: {
        type: String,
        required: true,
        validate(value: string) {
            if (value === undefined) throw new Error("A last name must be set.");
        },
    },
    email: {
        type: String,
        required: true,
        validate(value: string) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            if (!emailRegex.test(value)) throw new Error("A valid email address must be set");
        },
    },
    password: {
        type: String,
        required: true,
        validate(value: string) {
            if (value === undefined) throw new Error("A password must be set.");
        },
    },
}, {
    versionKey: false
});

export default model<User>("User", UserSchema)
