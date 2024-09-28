import express from 'express';

const router = express.Router();

import { getUsers, createUser, getUserByEmail, updateUser, deleteUser } from './Controllers/userController.js';
import { getEquipmentCategories, createEquipmentCategory, getEquipmentCategoryById, updateEquipmentCategory, deleteEquipmentCategory } from './Controllers/equipmentCategoryController.js';
import { getEquipments, getEquipmentById, createEquipment, updateEquipment, deleteEquipment } from './Controllers/equipmentsController.js';

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
router.post('/equipment', createEquipment);
router.put('/equipment/:id', updateEquipment);
router.delete('/equipment/:id', deleteEquipment);

export default router;