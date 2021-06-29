import { StatusCodes } from "http-status-codes";
import { cannotDeleteAllObjects, cannotFetchObjects, errorCreatingObject, invalidUserEmail, invalidUserPasswordContent, invalidUserPasswordLength, missingFieldsMessage, objectNotFound } from "../messages/errorMessage";
import { User as UserModel } from "../models/users/user";
import User from '../models/schemas/usersSchema';
import { validateUserEmail, validateUserMandatoryFields, validateUserPasswordContents, validUserPasswordLength } from "../validators/usersValidator";
import bcrypt from 'bcrypt';
import { USERS_MIN_PASSWORD_LENGTH } from "../config/config";
import { allObjectsDeleted, objectDeleted } from "../messages/generalMessages";
import logger from "../logging/logger";
import passport from "../passport/passportSetup";

/**
 * Creates a user.
 * @param req http request.
 * @param resp https 
 */
export async function registerUser(req: any, resp: any) {

    let user: UserModel = req.body;
    let missingFields: string[] = validateUserMandatoryFields(user);

    if (missingFields.length > 0) {
        logger.error('server.users.post.fields.validation.failed')
        resp.status(StatusCodes.BAD_REQUEST).send(missingFieldsMessage(missingFields));
    } else if (!validUserPasswordLength(user.password, USERS_MIN_PASSWORD_LENGTH as number)) {
        logger.error('server.users.post.password.validation.failed')
        resp.status(StatusCodes.BAD_REQUEST).send(invalidUserPasswordLength(USERS_MIN_PASSWORD_LENGTH as number));
    } else if (!validateUserPasswordContents(user.password)) {
        logger.error('server.users.post.password.validation.failed')
        resp.status(StatusCodes.BAD_REQUEST).send(invalidUserPasswordContent);
    } else if (!validateUserEmail(user.email)) {
        logger.error('server.users.post.email.validation.failed')
        resp.status(StatusCodes.BAD_REQUEST).send(invalidUserEmail);
    } else {

        let hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        try {
            User.register(new User({
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName
            }),
                req.body.password, (err, user) => {
                    if (err) {
                        resp.setHeader('Content-Type', 'application/json');
                        if (err.name === 'UserExistsError') {
                            resp.statusCode = 409;
                            resp.json(err.message);
                        } else {
                            resp.statusCode = 500;
                            resp.json({
                                err: err
                            });
                        }
                        logger.error('server.users.post.failed')
                    } else {
                        passport.authenticate('local')(req, resp, () => {
                            User.findOne({
                                email: req.body.email
                            }, (err: any, user: any) => {
                                resp.statusCode = 201;
                                resp.setHeader('Content-Type', 'application/json');
                                resp.json(user);
                            });
                        })
                        logger.error('server.users.post.success')
                    }
                })

        } catch (err) {
            logger.error('server.users.post.failed')
            resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
        }
    }



}

/**
 * Gets all users.
 * @param req http request.
 * @param resp http response.
 */
export async function getUsers(req: any, resp: any) {
    // 
    await User.find({}).then((users: any) => {
        resp.setHeader('Content-Type', 'application/json');
        resp.status(StatusCodes.OK).send(users)
        logger.info('server.users.get.all.success')
    }).catch((err: Error) => {
        logger.error(err.message)
        logger.error('server.users.get.all.failed')
        resp.status(StatusCodes.INTERNAL_SERVER_ERROR).send(cannotFetchObjects('users'))
    });
}


/**
 * Deletes the user with the matching ID.
 * @param req http request.
 * @param resp https 
 */
export async function deleteUser(req: any, resp: any) {

    await User.findByIdAndDelete(req.params._id).then((user: any) => {
        resp.setHeader('Content-Type', 'application/json');
        resp.status(StatusCodes.OK).json(objectDeleted('user'))
    }).catch((err: Error) => {
        resp.status(StatusCodes.NOT_FOUND).json(objectNotFound('user'))
    })
}

/**
 * Deletes all users.
 * @param req http request.
 * @param resp https 
 */
export async function deleteUsers(req: any, resp: any) {


    await User.deleteMany({}).then((user: any) => {
        resp.setHeader('Content-Type', 'application/json');
        resp.status(StatusCodes.OK).json(allObjectsDeleted('users'))
    }).catch((err: Error) => {
        resp.status(StatusCodes.NOT_FOUND).json(cannotDeleteAllObjects('users'))
    })
}


