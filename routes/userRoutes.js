const express = require('express');
const { getUsers, updateStatus } = require('../controllers/userController');
const protect = require('../middlewares/auth');
const router = express.Router();

router.get('/', protect, getUsers);
router.post('/status', protect, updateStatus);

module.exports = router;
