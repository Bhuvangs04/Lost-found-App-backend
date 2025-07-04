const Item = require('../models/Item');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { sendPushNotification } = require('../utils/notifications'); // make sure this is correctly imported


exports.getItems = async (req, res) => {
    try {
        const { type } = req.query;

        const query = {};
        if (type === 'lost' || type === 'found') {
            query.type = type;
        }

        const items = await Item.find(query).populate('userId', '-password -pushToken');
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getItem = async (req, res) => {
    const item = await Item.findById(req.params.id).populate('userId', '-password -pushToken');
    console.error('Item not found:', item);
    res.json(item);
};
exports.createItem = async (req, res) => {
    try {
        // Create the new item with current user ID
        const newItem = await Item.create({ ...req.body, userId: req.user.id });

        // Find matching items of the opposite type

        const matchingItems = await Item.find({
        
            type: newItem.type === 'lost' ? 'found' : 'lost',
            category: newItem.category,
            location: newItem.location,
            status: "active"
        });

        // Notify users who posted matching items
        for (const match of matchingItems) {
            const user = await User.findById(match.userId);
            if (user?.pushToken) {
                console.log(`Sending notification to user ${user._id} for match:`, match);
                await sendPushNotification(user.pushToken, {
                    title: '📢 Possible Item Match Found',
                    body: `A new item matches your ${match.type} item "${match.title}"`,
                    data: { itemId: newItem._id.toString() }
                });
            }
        }

        res.status(201).json(newItem);
    } catch (error) {
        console.error('❌ Error creating item:', error);
        res.status(500).json({ message: 'Failed to create item' });
    }
};
exports.updateItem = async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
};
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Delete related messages and conversations
        await Message.deleteMany({ itemId: req.params.id });
        await Conversation.deleteMany({ itemId: req.params.id });

        // Notify the user
        const user = await User.findOne({ _id: item.userId });
        if (user?.pushToken) {
            console.log(`Sending deletion notification to user ${user._id} for item "${item.title}"`);
            await sendPushNotification(user.pushToken, {
                title: '🗑️ Item Deleted',
                body: `Your item "${item.title}" has been deleted successfully.`,
            });
        }

        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Failed to delete item' });
    }
};

exports.resolveItem = async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
    res.json(item);
};
exports.searchItems = async (req, res) => {
    const { search, category, type } = req.query;

    const query = {
        $and: [
            {
                $or: [
                    { title: new RegExp(search, 'i') },
                    { type: new RegExp(search, 'i') },
                    { category: new RegExp(search, 'i') }
                ]
            }
        ]
    };

    // Add category filter if provided
    if (category) {
        query.$and.push({ category: category });
    }

    // Add type filter if provided
    if (type) {
        query.$and.push({ type: type });
    }

    try {
        const items = await Item.find(query).populate('userId', '-password');

        res.json(items);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search items'
        });
    }
};

exports.getUserItems = async (req, res) => {
    const items = await Item.find({ userId: req.user.id });
    res.json(items);
};
