const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const itemRoutes = require('./routes/items');
const notificationRoutes = require('./routes/notifications');
const messagesRoutes = require('./routes/messagesRoutes');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/messages', messagesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Lost and Found API');
}
);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

module.exports = app;