const Chat = require('../models/Chat');

exports.createChat = async (req, res) => {
    const { userIds, isGroupChat, name } = req.body;
    try {
        const chat = await Chat.create({
            users: [...userIds, req.user.id],
            isGroupChat,
            name
        });
        res.status(201).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUserChats = async (req, res) => {
    console.log("🚀 ~ exports.getUserChats= ~ req:", req)
    try {
        const chats = await Chat.find({ users: req.user.id })
            .populate('users', 'username email status')
            .populate('lastMessage');
        res.json(chats);
    } catch (error) {
        console.log("🚀 ~ exports.getUserChats= ~ error:", error)
        res.status(500).json({ error: error.message });
    }
};
