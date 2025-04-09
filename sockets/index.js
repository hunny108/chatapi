const { Server } = require('socket.io');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

let onlineUsers = new Map();

function initSocket(server, redisClient) {
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {
    socket.on('login', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('user-status', { userId, status: 'online' });
    });

    socket.on('logout', (userId) => {
      onlineUsers.delete(userId);
      io.emit('user-status', { userId, status: 'offline' });
    });

    socket.on('typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('typing', { userId });
    });

    socket.on('stop-typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('stop-typing', { userId });
    });

    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('new-message', async (messageData) => {
      console.log("🚀 ~ socket.on ~ messageData:", messageData)
      const message = await Message.create(messageData);
      await Chat.findByIdAndUpdate(message.chat, { lastMessage: message._id });
      io.to(message.chat).emit('message-received', message);
    });

    socket.on('disconnect', () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('user-status', { userId, status: 'offline' });
          break;
        }
      }
    });
  });
}

module.exports = { initSocket };
