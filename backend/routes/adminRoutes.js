const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, toggleUserRole } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', toggleUserRole);

module.exports = router;
