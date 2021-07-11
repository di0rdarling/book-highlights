
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../models/schemas/usersSchema';
import app from '../app';
import bcyrpt from 'bcrypt';
import { router } from '../routes/usersRoutes';
import { AUTH_BASE_URL, MONGODB_URI, USERS_MIN_PASSWORD_LENGTH } from '../config/config';
import { User as UserModel } from '../models/users/user';
import { invalidUserEmail, invalidUserPasswordContent, invalidUserPasswordLength, missingFieldsMessage, userAlreadyExists } from '../messages/errorMessage';

jest.setTimeout(40000)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const USERS_REGISTER_URL = `${AUTH_BASE_URL}/register`;
const USERS_LOGIN_URL = `${AUTH_BASE_URL}/login`;

describe('Tests Authorisation Routes', () => {
    beforeEach((done) => {
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                mongoose.connection.db.dropDatabase();
                done();
            }).catch(err => {
                throw new Error('Unable to connect to database.')
            });
    })

    it('Registers a new User', async () => {
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
            .post(USERS_REGISTER_URL)
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

    it('Returns 409 Conflict when a user is already registered with the given email.', async () => {
        //Setup
        let hashedPassword1 = await bcyrpt.hash('Password111', 10)
        let hashedPassword2 = await bcyrpt.hash('Password222', 10)

        let existingUsers: UserModel[] = [{
            firstName: 'Test1',
            lastName: 'User1',
            email: 'test1.user@gmail.com',
            password: hashedPassword1
        }, {
            firstName: 'Test2',
            lastName: 'User2',
            email: 'test.user2@gmail.com',
            password: hashedPassword2
        }]

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.insertMany(existingUsers).then((users: any) => {
            users.map((user: any, i: number) => {
                existingUsers[i]._id = user._id.toString();
            })
        }).catch((err: any) => {
            throw new Error('Unable to insert users to database.')
        });

        let selectedExistingUser = existingUsers[0];
        selectedExistingUser.password = 'Password111'

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_REGISTER_URL)
            .send(selectedExistingUser);

        //Assert
        expect(actualHttpResponse.status).toBe(409)
        expect(actualHttpResponse.body).toEqual(userAlreadyExists)
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
            .post(USERS_REGISTER_URL)
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
            .post(USERS_REGISTER_URL)
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
            .post(USERS_REGISTER_URL)
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
            .post(USERS_REGISTER_URL)
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
            .post(USERS_REGISTER_URL)
            .send(user);

        //Assert
        expect(actualHttpResponse.status).toBe(400)
        expect(actualHttpResponse.text).toBe(invalidUserEmail)

        //Assert database has not been updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let users = await User.find({});
        expect(users).toHaveLength(0);
    })

    it(`Successfully logs in an existing user.`, async () => {
        //Setup
        let password = 'Password111'
        let hashedPassword1 = await bcyrpt.hash(password, 10)

        let existingUser: UserModel = {
            firstName: 'Test1',
            lastName: 'User1',
            email: 'test1.user@gmail.com',
            password: hashedPassword1
        }

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.insertMany([existingUser]).then((users: any) => {
            users.map((user: any, i: number) => {
                existingUser._id = user._id.toString();
            })
        }).catch((err: any) => {
            throw new Error('Unable to insert users to database.')
        });

        let loginCredentials = {
            email: existingUser.email,
            password: password
        }
        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_LOGIN_URL)
            .send(loginCredentials);

        //Assert
        expect(actualHttpResponse.status).toBe(200)
        expect(actualHttpResponse.body).toHaveProperty('token')

    })

    it(`Returns 401 Unauthorised when an invalid password is given.`, async () => {
        //Setup
        let password = 'Password111'
        let hashedPassword1 = await bcyrpt.hash(password, 10)

        let existingUser: UserModel = {
            firstName: 'Test1',
            lastName: 'User1',
            email: 'test1.user@gmail.com',
            password: hashedPassword1
        }

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.insertMany([existingUser]).then((users: any) => {
            users.map((user: any, i: number) => {
                existingUser._id = user._id.toString();
            })
        }).catch((err: any) => {
            throw new Error('Unable to insert users to database.')
        });

        let loginCredentials = {
            email: existingUser.email,
            password: `${password}145`
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_LOGIN_URL)
            .send(loginCredentials);

        //Assert
        expect(actualHttpResponse.status).toBe(401)
        expect(actualHttpResponse.text).toBe('Unauthorized')

    })

    it(`Returns 401 Unauthorised when an invalid email and password is given.`, async () => {
        //Setup
        let password = 'Password111'
        let hashedPassword1 = await bcyrpt.hash(password, 10)

        let existingUser: UserModel = {
            firstName: 'Test1',
            lastName: 'User1',
            email: 'test1.user@gmail.com',
            password: hashedPassword1
        }

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.insertMany([existingUser]).then((users: any) => {
            users.map((user: any, i: number) => {
                existingUser._id = user._id.toString();
            })
        }).catch((err: any) => {
            throw new Error('Unable to insert users to database.')
        });

        let loginCredentials = {
            email: `sa.${existingUser.email}`,
            password: `${password}145`
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post(USERS_LOGIN_URL)
            .send(loginCredentials);

        //Assert
        expect(actualHttpResponse.status).toBe(401)
        expect(actualHttpResponse.text).toBe('Unauthorized')

    })

})

/**
 * Maps a given user schema to a user model.
 * @param userSchema user schema.
 * @returns a mapped user model.
 */
function mapUserSchemaToUserModel(userSchema: any) {
    let user: UserModel = {
        _id: userSchema._id.toString(),
        firstName: userSchema.firstName,
        lastName: userSchema.lastName,
        email: userSchema.email,
        password: userSchema.password
    }

    return user;
}

