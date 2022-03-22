import { verifyToken } from '../utils/helpers.js';
import express from 'express';
import userController from '../controllers/users.js';

const router = express.Router();

router.post('/', userController.register);
router.post('/login', userController.loginUser);
router.put('/', verifyToken, userController.editUser);
router.delete('/:username', verifyToken, userController.deleteUser);

export default router;