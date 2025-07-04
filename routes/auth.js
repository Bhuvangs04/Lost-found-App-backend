const router = require('express').Router();
const { register, login } = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);
const auth = require('../utils/authMiddleware');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { sendPushNotificationOTP } = require('../utils/notifications'); // Ensure this is correctly imported
const { sendEmail } = require('../utils/sendEmail'); // Ensure this is correctly imported


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "freelancer.hub.nextgen@gmail.com",
        pass: "niuqhrvoyeumqtrz",
    },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
    await transporter.sendMail({
        from: "freelancer.hub.nextgen@gmail.com",
        to: email,
        subject: 'Your Verification OTP',
        text: `Your OTP is ${otp}`,
    });
  };

router.post('/send-verification-otp', auth, async (req, res) => {
    const userId = req.user.id; // Assuming authenticated user
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { otp, otpExpiresAt, isVerified: false },
            { upsert: true }
        );
        await sendOTPEmail(user.email, otp);
        res.json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
        console.error('Error sending OTP:', err);
        res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
});

// 🔐 POST /auth/verify-email
router.post('/verify-email', auth,async (req, res) => {
    const userId = req.user.id; // Assuming authenticated user
    const { otp } = req.body;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user || user.otp !== otp) {
            return res.status(400).json({ success: false, error: 'Invalid OTP' });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({ success: false, error: 'OTP expired' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        user.emailExpiresAt = undefined; // Clear email expiration if needed
        await user.save();

        const notificationTitle = 'Email Verified 🎉';
        const notificationBody = 'Your email has been successfully verified. You are now a verified user!';

        if (user.pushToken) {
            try {
                await sendPushNotificationOTP(user.pushToken,{
                    title: notificationTitle,
                    body: notificationBody
                });
            } catch (pushErr) {
                console.error('Push notification failed:', pushErr);
                // fallback to email
                await sendEmail({
                    to: user.email,
                    subject: notificationTitle,
                    text: notificationBody,
                });
            }
        } else {
            // No push token → send email instead
            await sendEmail({
                to: user.email,
                subject: notificationTitle,
                text: notificationBody,
            });
        }
        res.json({ success: true, message: 'Email verified', user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Verification failed' });
    }
});

// 🔁 POST /auth/resend-verification-otp
router.post('/resend-verification-otp', auth, async (req, res) => {
    const userId = req.user.id; // Assuming authenticated user
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
        const user = await User.findOneAndUpdate({ _id: userId }, { otp, otpExpiresAt });
        await sendOTPEmail(user.email, otp);
        res.json({ success: true, message: 'OTP resent to email' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to resend OTP' });
    }
});
module.exports = router;