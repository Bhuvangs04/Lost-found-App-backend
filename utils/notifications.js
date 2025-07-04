// utils/notifications.js
const axios = require('axios');

exports.sendPushNotification = async (to, { title, body, data }) => {
    await axios.post('https://exp.host/--/api/v2/push/send', {
        to,
        title,
        body,
        sound: 'default',
        data,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

exports.sendPushNotificationOTP = async (to, { title, body }) => {
    await axios.post('https://exp.host/--/api/v2/push/send', {
        to,
        title,
        body,
        sound: 'default',
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
