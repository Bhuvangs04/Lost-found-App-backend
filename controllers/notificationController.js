const User = require('../models/User');
exports.registerPushToken = async (req, res) => {
    const { pushToken } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { pushToken }, { new: true });
    res.json(user);
};