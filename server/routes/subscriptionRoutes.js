const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// CRUD операции
router.get('/', subscriptionController.getAll);
router.post('/', subscriptionController.create);
router.get('/check/:id/exists', subscriptionController.exists);
router.get('/:id', subscriptionController.getById);
router.put('/:id', subscriptionController.update);
router.delete('/:id', subscriptionController.delete);

module.exports = router;
