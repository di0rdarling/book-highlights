import logger from '../logging/logger'
import { createUser, deleteUser, deleteUsers as deleteAllUsers, getUsers as getAllUsers} from '../services/usersService'

/**
 * Posts a user.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function postUser(req: any, res: any) {
    logger.info('server.users.post.called')
    createUser(req, res)
}

/**
 * Gets all users.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function getUsers(req: any, res: any) {
    logger.info('server.users.get.called')
    getAllUsers(req, res)
}

/**
 * Deletes the user with the matching id.
 * @param req http request.
 * @param resp http response.
 */
export async function deleteUserById(req: any, res: any) {
     logger.info('server.users.delete.id.called')
    deleteUser(req, res)
}

/**
 * Deletes all users.
 * @param req http request.
 * @param resp http response.
 */
export async function deleteUsers(req: any, res: any) {
     logger.info('server.users.delete.called')
    deleteAllUsers(req, res)
}