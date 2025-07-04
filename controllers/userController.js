const User = require('../models/User');
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user);
};
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const updates = req.body;

        // If email is being changed, reset verification
        if (updates.email && updates.email !== user.email) {
            updates.isVerified = false;
            updates.emailExpiresAt = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // 4 days from now
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        res.json(updatedUser);
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

exports.updateNotifications = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        notificationPreferences: req.body.notificationPreferences
    }, { new: true });
    res.json(user);
};