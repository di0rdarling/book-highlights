
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { router } from '../routes/usersRoutes';
import { MONGODB_URI, USERS_BASE_URL, USERS_MIN_PASSWORD_LENGTH } from '../config/config';
import { User as UserModel } from '../models/users/user';
import app from '../app';
import User from '../models/schemas/usersSchema';
import { invalidUserEmail, invalidUserPasswordContent, invalidUserPasswordLength, missingFieldsMessage } from '../messages/errorMessage';
import bcyrpt from 'bcrypt';
import { allObjectsDeleted, objectDeleted } from '../messages/generalMessages';

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

it('Deletes the user with the matching Id.', async () => {
    //Setup
    let hashedPassword1 = await bcyrpt.hash('Password111', 10)
    let hashedPassword2 = await bcyrpt.hash('Password222', 10)

    let existingUsers: UserModel[] = [{
        firstName: 'Test1',
            lastName: 'User1',
            email: 'test1.user@gmail.com',
            password:  hashedPassword1
    }, {
        firstName: 'Test2',
            lastName: 'User2',
            email: 'test.user2@gmail.com',
            password:  hashedPassword2
    }]

    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.insertMany(existingUsers).then((users: any) => {
        users.map((user: any, i: number) => {
            existingUsers[i]._id = user._id.toString();
        })
    }).catch((err: any) => {
        throw new Error('Unable to insert users to database.')
    });

    let selectedUser = existingUsers[0]

    //Run test
    const actualHttpResponse = await request(app)
        .delete(`${USERS_BASE_URL}/${selectedUser._id}`);

    //Assert
    expect(actualHttpResponse.status).toBe(200);
    expect(actualHttpResponse.text).toBe(objectDeleted('user'));

    //Assert database has been correctly updated.
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    let users = await User.find({});
    let mappedUsers = users.map((h: any) => mapUserSchemaToUserModel(h));
    expect(mappedUsers).toHaveLength(1)
    expect(mappedUsers[0]).toEqual(existingUsers[1])
})

it('Deletes all the existing users.', async () => {
    //Setup
    let hashedPassword1 = await bcyrpt.hash('Password111', 10)
    let hashedPassword2 = await bcyrpt.hash('Password222', 10)

    let existingUsers: UserModel[] = [{
        firstName: 'Test1',
            lastName: 'User1',
            email: 'test1.user@gmail.com',
            password:  hashedPassword1
    }, {
        firstName: 'Test2',
            lastName: 'User2',
            email: 'test.user2@gmail.com',
            password:  hashedPassword2
    }]

    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.insertMany(existingUsers).then((users: any) => {
        users.map((user: any, i: number) => {
            existingUsers[i]._id = user._id;
        })
    }).catch((err: any) => {
        throw new Error('Unable to insert users to database.')
    });

    //Run test
    const actualHttpResponse = await request(app)
        .delete(USERS_BASE_URL);

    //Assert
    expect(actualHttpResponse.status).toBe(200);
    expect(actualHttpResponse.text).toBe(allObjectsDeleted('users'));

    //Assert database has been correctly updated.
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    let users = await User.find({});
    expect(users).toHaveLength(0)
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

    