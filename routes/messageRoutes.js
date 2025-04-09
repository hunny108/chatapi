const express = require('express');
const { sendMessage, getMessages, markAsRead } = require('../controllers/messageController');
const protect = require('../middlewares/auth');
const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', getMessages);
router.post('/read/:messageId', protect, markAsRead);

module.exports = router;
