const { Router } = require("express");
const chatController = require('../controllers/chatController');

const {
  requireAuth,
  checkUser,
  requireAuthAdmin,
} = require("../middleware/authMiddleware");

const router = Router();

//get all chats that the user is a member of
router.get('/', requireAuth, chatController.getAllChatsForUser);

//create a new chat
router.post('/', requireAuth, chatController.createChat);

//get all message for a chat
router.get('/:chatId/messages', requireAuth, chatController.getAllMessagesForChat);

//send a message in a chat
router.post('/:chatId/messages', requireAuth, chatController.sendMessage);

module.exports = router;
