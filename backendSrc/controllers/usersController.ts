import logger from '../logging/logger'
import { createUser } from '../services/usersService'
/**
 * Posts a user.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function postUser(req: any, res: any) {
    logger.info('server.users.post.called')
    createUser(req, res)
}