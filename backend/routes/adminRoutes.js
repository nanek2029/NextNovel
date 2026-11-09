const express = require('express');
const router = express.Router();

const {
    getUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/users', requireAdmin, getUsers);
router.delete('/users/:userId', requireAdmin, deleteUser);
router.patch('/users/:userId/role', requireAdmin, updateUserRole);

module.exports = router;
