import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getItems, createItem, updateItem, deleteItem, getUserBanks } from '../controllers/item.controller.js';
import cloudinaryConfig from '../config/cloudinary.js';

const router = express.Router();

router.get('/user', protect, getItems);

router.get('/banks', protect, getUserBanks);

router.post('/', protect, cloudinaryConfig.upload.single('image'), createItem);

router.put('/:id', protect, cloudinaryConfig.upload.single('image'), updateItem);

router.delete('/:id', protect, deleteItem);

export default router;
