import express from 'express';

const router = express.Router();

import { getUsers, createUser, getUserByEmail, updateUser, deleteUser } from './Controllers/userController.js';

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:email', getUserByEmail);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;