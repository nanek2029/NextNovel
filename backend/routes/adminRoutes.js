const express = require('express');
const router = express.Router();

const {
    getUsers,
    deleteUser
} = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/users', requireAdmin, getUsers);
router.delete('/users/:userId', requireAdmin, deleteUser);

module.exports = router;
