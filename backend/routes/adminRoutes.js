const express = require('express');
const router = express.Router();

const {
    getUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/users', requireAuth, requireAdmin, getUsers);
router.delete('/users/:userId', requireAuth, requireAdmin, deleteUser);
router.patch('/users/:userId/role', requireAuth, requireAdmin, updateUserRole);

module.exports = router;
