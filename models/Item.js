const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    images: {
        type: [String],
        default: [],
    },
        location: String,
    category: String,
    tags: [String],
    status: {
        type: String,},

    type: {
        type: String,
        enum: ['lost', 'found', 'resolved'],
        default: 'lost'
    },
    Reward: {
        type: Number,
        default: 0
    },
    contactInfo: {
        email: String,
        phone: String,
        preferredMethod: {
            type: String,
            enum: ['email', 'phone'],
        }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
