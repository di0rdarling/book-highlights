import { Schema, Document, model, PassportLocalSchema } from 'mongoose';
import { User as UserModel } from '../users/user';
import { userAlreadyExists } from '../../messages/errorMessage';
import Connection from '../../database/connection';
import passportLocalMongoose from 'passport-local-mongoose';

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

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    errorMessages: {
        UserExistsError: userAlreadyExists
    }
});


export default model<User>("User", UserSchema as PassportLocalSchema)
