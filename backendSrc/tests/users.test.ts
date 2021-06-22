
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { router } from '../routes/highlightRoutes';
import { MONGODB_URI, USERS_BASE_URL, USERS_MIN_PASSWORD_LENGTH } from '../config/config';
import { User as UserModel } from '../models/users/user';
import app from '../app';
import User from '../models/schemas/usersSchema';
import { invalidUserEmail, invalidUserPasswordContent, invalidUserPasswordLength, missingFieldsMessage } from '../messages/errorMessage';

jest.setTimeout(40000)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

describe('Tests Users Routes', () => {
    beforeEach((done) => {
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                mongoose.connection.db.dropDatabase();
                done();
            }).catch(err => {
                throw new Error('Unable to connect to database.')
            });
    })

    it('Creates a new User object', async () => {
        //Setup
        let user: UserModel = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user@gmail.com',
            password: 'Password123'
        }

        let expectedUserModel = {
            _id: null,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_BASE_URL)
            .send(user);


        //Assert
        expect(actualHttpResponse.status).toBe(201)
        //Set the returned id as this was not known before the request was made.
        expectedUserModel._id = actualHttpResponse.body._id;
        //Set the returned hashed password.
        expectedUserModel.password = actualHttpResponse.body.password;

        expect(actualHttpResponse.body === expectedUserModel)

        //Assert database has been correctly updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let users = await User.find({});
        expect(users).toHaveLength(1);

        let actualUserModel = mapUserSchemaToUserModel(users[0]);
        expect(actualUserModel).toEqual(expectedUserModel);
    })

    it('Returns 400 Bad Request when the mandatory fields are not provided when creating a user', async () => {
        //Setup
        let missingUserFields = [
            'firstName',
            'lastName',
            'email',
            'password'
        ]

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_BASE_URL)
            .send({});

        //Assert
        expect(actualHttpResponse.status).toBe(400)
        expect(actualHttpResponse.text).toEqual(missingFieldsMessage(missingUserFields))
    })
   
    it(`Returns a bad request 400 when a password of less than ${USERS_MIN_PASSWORD_LENGTH} characters is given`, async () => {
        //Setup
        let user: UserModel = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user@gmail.com',
            password: 'Pass'
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_BASE_URL)
            .send(user);

        //Assert
        expect(actualHttpResponse.status).toBe(400)
        expect(actualHttpResponse.text).toBe(invalidUserPasswordLength(USERS_MIN_PASSWORD_LENGTH as number))

        //Assert database has not been updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let users = await User.find({});
        expect(users).toHaveLength(0);

    })
    
    it(`Returns a bad request 400 when a password does not contain one uppercase letter.`, async () => {
        //Setup
        let user: UserModel = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user@gmail.com',
            password: 'password123'
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_BASE_URL)
            .send(user);

        //Assert
        expect(actualHttpResponse.status).toBe(400)
        expect(actualHttpResponse.text).toBe(invalidUserPasswordContent)

        //Assert database has not been updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let users = await User.find({});
        expect(users).toHaveLength(0);
    })
    
    it(`Returns a bad request 400 when a password does not contain one number.`, async () => {
        //Setup
        let user: UserModel = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user@gmail.com',
            password: 'Password'
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_BASE_URL)
            .send(user);

        //Assert
        expect(actualHttpResponse.status).toBe(400)
        expect(actualHttpResponse.text).toBe(invalidUserPasswordContent)

        //Assert database has not been updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let users = await User.find({});
        expect(users).toHaveLength(0);
    })
    
    it(`Returns a bad request 400 when an invalid email address is given.`, async () => {
        //Setup
        let user: UserModel = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user.gmail',
            password: 'Password123'
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_BASE_URL)
            .send(user);

        //Assert
        expect(actualHttpResponse.status).toBe(400)
        expect(actualHttpResponse.text).toBe(invalidUserEmail)

        //Assert database has not been updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let users = await User.find({});
        expect(users).toHaveLength(0);
    })
})

/**
 * Maps a given user schema to a user model.
 * @param userSchema user schema.
 * @returns a mapped user model.
 */
function mapUserSchemaToUserModel(userSchema: any){
    let user: UserModel = {
        _id: userSchema._id.toString(),
        firstName: userSchema.firstName,
        lastName: userSchema.lastName,
        email: userSchema.email,
        password: userSchema.password
    }

    return user;
}

    