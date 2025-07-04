const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }]
}, { timestamps: true });

// Add indexes for better performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ itemId: 1, participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);