import express from 'express';
import { postUser, deleteUsers, deleteUserById, getUsers} from '../controllers/usersController';

export const router = express.Router();

router.route('/').post(postUser);

router.route('/').get(getUsers);

router.route('/:_id').delete(deleteUserById);

router.route('/').delete(deleteUsers);

