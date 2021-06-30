import logger from '../logging/logger'
import { registerUser as regsiterNewUser, loginUser as loginExistingUser } from '../services/authorisationService'
import express from 'express';

/**
 * Registers a new user.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function registerUser(req: express.Request, res: express.Response) {
    logger.info('server.users.post.register.called')
    regsiterNewUser(req, res)
}

/**
 * Logs in a user.
 * @param {object} req http request.
 * @param {object} res http response.
 */
export async function loginUser(req: express.Request, res: express.Response) {
    logger.info('server.users.post.login.called')
    loginExistingUser(req, res)
}
