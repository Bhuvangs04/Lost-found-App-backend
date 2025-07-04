const router = require('express').Router();
const auth = require('../utils/authMiddleware');
const { getProfile, updateProfile, updateNotifications } = require('../controllers/userController');
router.use(auth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/notifications', updateNotifications);
module.exports = router;