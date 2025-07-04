const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');
const ctrl = require('../controllers/messagesController');

// Apply authentication middleware
router.use(auth);

// ✅ Most specific routes first - FIXED ORDER
router.get('/conversations/messages/:conversationId', ctrl.getMessages);
router.put('/conversations/:conversationId/read', ctrl.markConversationAsRead);
router.get('/conversations/:itemId/:otherUserId', ctrl.getConversation); // NEW ROUTE
router.put('/:messageId/read', ctrl.markMessageAsRead);

// ✅ General routes after
router.get('/conversations', ctrl.getConversations);

// ✅ Message send route
router.post('/', ctrl.sendMessage);

module.exports = router;