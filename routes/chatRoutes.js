const express = require('express');
const { createChat, getUserChats } = require('../controllers/chatController');
const protect = require('../middlewares/auth');
const router = express.Router();

router.post('/', protect, createChat);
router.get('/', protect, getUserChats);

module.exports = router;
