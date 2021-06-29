import express from 'express';
import { registerUser, deleteUsers, deleteUserById, getUsers} from '../controllers/usersController';

export const router = express.Router();

router.route('/register').post(registerUser);

router.route('/').get(getUsers);

router.route('/:_id').delete(deleteUserById);

router.route('/').delete(deleteUsers);

