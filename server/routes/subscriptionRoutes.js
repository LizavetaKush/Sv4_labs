const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateToken, authorize } = require('../middleware/auth');

// CRUD операции (все защищены JWT)
router.get('/', authenticateToken, subscriptionController.getAll);
router.post('/', authenticateToken, authorize('admin'), subscriptionController.create);
router.get('/check/:id/exists', authenticateToken, subscriptionController.exists);
router.get('/:id', authenticateToken, subscriptionController.getById);
router.put('/:id', authenticateToken, authorize('admin'), subscriptionController.update);
router.delete('/:id', authenticateToken, authorize('admin'), subscriptionController.delete);

module.exports = router;
