const router = require('express').Router();
const auth = require('../utils/authMiddleware');

const { getItems, getItem, createItem, updateItem, deleteItem, resolveItem, searchItems, getUserItems } = require('../controllers/itemController');
router.use(auth);
router.get('/', getItems);
router.get('/my-items', getUserItems);
router.post('/', createItem);
router.get('/search', searchItems);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.post('/:id/resolve', resolveItem);
module.exports = router;