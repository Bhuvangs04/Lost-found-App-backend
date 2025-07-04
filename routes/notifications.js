const router = require('express').Router();
const axios = require('axios');
const auth = require('../utils/authMiddleware');
const { registerPushToken } = require('../controllers/notificationController');
router.use(auth);
router.post('/register-token', registerPushToken);

router.post('/send', async (req, res) => {
    const { to, title, body, data } = req.body;

    if (!to || !title || !body) {
        return res.status(400).json({ message: 'Missing required fields: to, title, body' });
    }

    try {
        const response = await axios.post('https://exp.host/--/api/v2/push/send', {
            to,
            title,
            body,
            sound: 'default',
            data,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
            },
        });

        return res.status(200).json({ message: 'Notification sent', expoResponse: response.data });
    } catch (error) {
        console.error('❌ Push notification error:', error.message);
        return res.status(500).json({ message: 'Failed to send notification' });
    }
});

module.exports = router;