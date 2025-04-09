const Message = require('../models/Message');
const Chat = require('../models/Chat');
const handleFileUpload = require('../utils/fileUpload');

exports.sendMessage = async (req, res) => {
    const { chatId, content } = req.body;
    const attachments = [];

    if (req.files) {
        const files = Array.isArray(req.files.attachments)
            ? req.files.attachments
            : [req.files.attachments];

        files.forEach((file) => {
            const fileUrl = handleFileUpload(file);
            attachments.push(fileUrl);
        });
    }

    try {
        const message = await Message.create({
            sender: req.user.id,
            chat: chatId,
            content,
            attachments,
        });

        await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'username email');
        console.log("🚀 ~ exports.getMessages= ~ messages:", messages)
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.messageId,
            { isRead: true },
            { new: true }
        );
        res.json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
