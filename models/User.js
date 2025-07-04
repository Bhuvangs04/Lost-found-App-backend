const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    emailExpiresAt: Date,
    otp: String,
    otpExpiresAt: Date,
    name: { type: String, required: true },
    studentId:{ type: String, required: true, unique: true },
    college: { type: String, required: true },
    password: { type: String, required: true },
    pushToken: { type: String, default: '' },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
