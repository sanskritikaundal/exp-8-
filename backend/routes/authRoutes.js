const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

// Admin only routes
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
