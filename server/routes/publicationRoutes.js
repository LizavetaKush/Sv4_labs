const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');
const { authenticateToken, authorize } = require('../middleware/auth');

// CRUD операции (все защищены JWT)
router.get('/', authenticateToken, publicationController.getAll);
router.post('/', authenticateToken, authorize('admin'), publicationController.create);
router.get('/check/:id/exists', authenticateToken, publicationController.exists);
router.get('/:id', authenticateToken, publicationController.getById);
router.put('/:id', authenticateToken, authorize('admin'), publicationController.update);
router.delete('/:id', authenticateToken, authorize('admin'), publicationController.delete);

module.exports = router;
