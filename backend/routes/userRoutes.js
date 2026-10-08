import express from 'express';
import {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    getUsers, // NEW
    deleteUser // NEW
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// NEW: ADMIN ROUTES (GET ALL & DELETE)
router.route('/')
    .get(protect, admin, getUsers); // GET /api/users

router.route('/:id')
    .delete(protect, admin, deleteUser); // DELETE /api/users/:id

export default router;