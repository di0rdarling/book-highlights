import logger from '../logging/logger'
import { registerUser as regsiterNewUser, deleteUser, deleteUsers as deleteAllUsers, getUsers as getAllUsers} from '../services/usersService'
import express from 'express';

/**
 * Posts a user.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function registerUser(req: express.Request, res: express.Response) {
    logger.info('server.users.post.called')
    regsiterNewUser(req, res)
}

/**
 * Gets all users.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getUsers(req: express.Request, res: express.Response) {
    logger.info('server.users.get.called')
    getAllUsers(req, res)
}

/**
 * Deletes the user with the matching id.
 * @param req http request.
 * @param resp http response.
 */
export async function deleteUserById(req: express.Request, res: express.Response) {
     logger.info('server.users.delete.id.called')
    deleteUser(req, res)
}

/**
 * Deletes all users.
 * @param req http request.
 * @param resp http response.
 */
export async function deleteUsers(req: express.Request, res: express.Response) {
     logger.info('server.users.delete.called')
    deleteAllUsers(req, res)
}