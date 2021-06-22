import express from 'express';
import { postUser } from '../controllers/usersController';

export const router = express.Router();

router.route('/').post(postUser);

