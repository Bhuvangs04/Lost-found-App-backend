const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { email, password, name, studentId, college } = req.body;
    console.error('Registering user:', req.body);
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already exists' });

        const hashed = await bcrypt.hash(password, 13);
        const emailExpiresAt = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // 4 days from now
        const user = await User.create({ email, password: hashed, name, studentId, college, emailExpiresAt });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(400).json({ message: 'Registration failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ user, token });
    } catch (err) {
        res.status(400).json({ message: 'Login failed', error: err.message });
    }
};