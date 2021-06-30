import User from '../models/schemas/usersSchema';
import logger from "../logging/logger";
import { StatusCodes } from "http-status-codes";
import { cannotDeleteAllObjects, cannotFetchObjects, objectNotFound } from "../messages/errorMessage";
import { allObjectsDeleted, objectDeleted } from "../messages/generalMessages";

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


