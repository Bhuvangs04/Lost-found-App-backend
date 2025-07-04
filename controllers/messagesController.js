const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get all conversations for current user
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Get Conversations for User:', userId);

        const convos = await Conversation.find({ participants: userId })
            .sort({ updatedAt: -1 })
            .populate('itemId', 'title type status location')
            .populate('participants', 'name email college studentId');

        // Get last message for each conversation
        const conversationsWithMessages = await Promise.all(
            convos.map(async (convo) => {
                const lastMessage = await Message.findOne({ conversationId: convo._id })
                    .sort({ createdAt: -1 })
                    .populate('senderId', 'name');

                const unreadCount = await Message.countDocuments({
                    conversationId: convo._id,
                    receiverId: userId,
                    isRead: false
                });

                // Find other participant
                const otherParticipant = convo.participants.find(
                    p => p._id.toString() !== userId.toString()
                );

                console.log('Conversation:', {
                    _id: convo._id,
                    itemId: convo.itemId,
                    participants: convo.participants,
                    lastMessage: lastMessage ? lastMessage.content : null,
                    lastMessageAt: lastMessage ? lastMessage.createdAt : convo.updatedAt,
                    unreadCount: unreadCount,
                    item: convo.itemId,
                    otherParticipant: otherParticipant ? otherParticipant.name : null,
                    createdAt: convo.createdAt,
                    updatedAt: convo.updatedAt
                });

                return {
                    _id: convo._id,
                    itemId: convo.itemId,
                    participants: convo.participants,
                    lastMessage: lastMessage,
                    lastMessageAt: lastMessage ? lastMessage.createdAt : convo.updatedAt,
                    unreadCount: unreadCount,
                    item: convo.itemId,
                    otherParticipant: otherParticipant,
                    createdAt: convo.createdAt,
                    updatedAt: convo.updatedAt
                };
            })
        );

        res.json({ success: true, data: conversationsWithMessages });
    } catch (error) {
        console.error('Get Conversations Error:', error);
        res.status(500).json({ success: false, error: 'Failed to get conversations' });
    }
};

// Get or create a conversation for specific item + user
exports.getConversation = async (req, res) => {
    try {
        const { itemId, otherUserId } = req.params;
        const userId = req.user.id;

        console.log('Get Conversation:', { itemId, userId, otherUserId });

        let convo = await Conversation.findOne({
            itemId,
            participants: { $all: [userId, otherUserId] }
        }).populate('participants itemId', '-password');

        if (!convo) {
            convo = await Conversation.create({
                itemId,
                participants: [userId, otherUserId]
            });

            // Populate the newly created conversation
            convo = await Conversation.findById(convo._id)
                .populate('participants itemId', '-password');
        }

        res.json({ success: true, data: convo });
    } catch (error) {
        console.error('Get Conversation Error:', error);
        res.status(500).json({ success: false, error: 'Failed to get conversation' });
    }
};

// Get messages in a conversation
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        console.log('Get Messages for Conversation:', conversationId);

        if (!conversationId || conversationId === 'undefined') {
            return res.status(400).json({ success: false, error: 'Invalid conversation ID' });
        }

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 })
            .populate('senderId', 'name')
            .populate('receiverId', 'name');

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ success: false, error: 'Failed to get messages' });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { itemId, receiverId, content } = req.body;
        const senderId = req.user.id;

        console.log('Send Message:', { itemId, senderId, receiverId, content });

        if (!itemId || !receiverId || !content) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: itemId, receiverId, content'
            });
        }

        // Ensure conversation exists
        let convo = await Conversation.findOne({
            itemId,
            participants: { $all: [senderId, receiverId] }
        });

        if (!convo) {
            convo = await Conversation.create({
                itemId,
                participants: [senderId, receiverId]
            });
        }

        const message = await Message.create({
            conversationId: convo._id,
            senderId: senderId,
            receiverId: receiverId,
            itemId,
            content: content.trim()
        });

        // Update conversation timestamp
        convo.updatedAt = new Date();
        await convo.save();

        // Populate the message before sending response
        const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'name')
            .populate('receiverId', 'name');

        res.json({ success: true, data: populatedMessage });
    } catch (err) {
        console.error('Send Message Error:', err);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
};

// Mark a message read
exports.markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        await Message.findByIdAndUpdate(messageId, { isRead: true });
        res.json({ success: true });
    } catch (error) {
        console.error('Mark Message Read Error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark message as read' });
    }
};

// Mark all messages in conversation as read
exports.markConversationAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        if (!conversationId || conversationId === 'undefined') {
            return res.status(400).json({ success: false, error: 'Invalid conversation ID' });
        }

        await Message.updateMany(
            { conversationId, receiverId: userId, isRead: false },
            { isRead: true }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Mark Conversation Read Error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark conversation as read' });
    }
};