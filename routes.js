import express from 'express';
import upload from './libs/multer.js';

const router = express.Router();
import { googleLogin } from './Controllers/authController.js';

import { getUsers, createUser, getUserByEmail, updateUser, deleteUser } from './Controllers/userController.js';
import { getEquipmentCategories, createEquipmentCategory, getEquipmentCategoryById, updateEquipmentCategory, deleteEquipmentCategory } from './Controllers/equipmentCategoryController.js';
import { getEquipments, getEquipmentById, createEquipment, updateEquipment, deleteEquipment } from './Controllers/equipmentsController.js';
import { getBorrowings, getBorrowingById, getBorrowingsByEquipmentId, getBorrowingsByUserId, createBorrowing, updateBorrowing, deleteBorrowing, approveBorrowing, returnBorrowing, cancelBorrowing } from './Controllers/borrowingController.js';

import { isAuth, isAdmin } from './middlewares.js';

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:email', getUserByEmail);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/equipment-categories', getEquipmentCategories);
router.get('/equipment-categories/:id', getEquipmentCategoryById);
router.post('/equipment-categories', createEquipmentCategory);
router.put('/equipment-categories/:id', updateEquipmentCategory);
router.delete('/equipment-categories/:id', deleteEquipmentCategory);

router.get('/equipment', getEquipments);
router.get('/equipment/:id', getEquipmentById);
router.post('/equipment', upload, createEquipment);
router.put('/equipment/:id', upload,updateEquipment);
router.delete('/equipment/:id', deleteEquipment);

router.get('/borrowings', getBorrowings);
router.get('/borrowings/:id', getBorrowingById);
router.get('/borrowings/user/:userId', getBorrowingsByUserId);
router.get('/borrowings/equipment/:equipmentId', getBorrowingsByEquipmentId);
router.post('/borrowings', createBorrowing);
router.put('/borrowings/:id', updateBorrowing);
router.put('/borrowings/approve/:id', approveBorrowing);
router.put('/borrowings/return/:id', returnBorrowing);
router.put('/borrowings/cancel/:id', cancelBorrowing);
router.delete('/borrowings/:id', deleteBorrowing);

router.post('/login', googleLogin);
router.get('/checkrole', isAuth, isAdmin, (req, res) => {
    res.json({ message: 'Authorized' });
});

export default router;