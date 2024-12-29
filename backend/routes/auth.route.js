import express from 'express';
import { registerUser, loginUser, getUserProfile } from "../controllers/auth.controller.js";
//import passport from 'passport';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

export default router;