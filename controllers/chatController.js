const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const decoded = require("../services/decodeToken")

// Get all chats that the user is a member of
const getAllChatsForUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decrypted = decoded(token);

    const userId = decrypted.data.user_id; // assuming authentication middleware is used to populate `req.user`
    const chats = await Chat.find({ members: userId }).populate('members', 'username email').populate('messages');
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving chats' });
  }
};

// Create a new chat
const createChat = async (req, res) => {
  try {
    const { name } = req.body;
    const token = req.headers.authorization;
    const decrypted = decoded(token);
    const memberIds = decrypted.data.user_id; 

    const chat = await Chat.create({ name, members: memberIds });
    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating chat' });
  }
};

// Get all messages for a chat
const getAllMessagesForChat = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chat: chatId }).populate('sender', 'username email');
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving messages for chat' });
  }
};

// Send a message in a chat
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const token = req.headers.authorization;
    const decrypted = decoded(token);

    const userId = decrypted.data.user_id;  // assuming authentication middleware is used to populate `req.user`
  
    const message = await Message.create({ chat: chatId, sender: userId, content });
    await Chat.updateOne({ _id: chatId }, { $push: { messages: message._id } });
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

module.exports = {
  getAllChatsForUser,
  createChat,
  getAllMessagesForChat,
  sendMessage
};
