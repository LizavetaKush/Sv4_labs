const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');
const { authenticateToken, authorize } = require('../middleware/auth');

// CRUD операции (все защищены JWT)
router.get('/', authenticateToken, recipientController.getAll);
router.post('/', authenticateToken, authorize('admin'), recipientController.create);
router.get('/check/:id/exists', authenticateToken, recipientController.exists);
router.get('/:id', authenticateToken, recipientController.getById);
router.put('/:id', authenticateToken, authorize('admin'), recipientController.update);
router.delete('/:id', authenticateToken, authorize('admin'), recipientController.delete);

module.exports = router;
