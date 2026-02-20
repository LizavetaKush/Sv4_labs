const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');

// CRUD операции
router.get('/', recipientController.getAll);
router.post('/', recipientController.create);
router.get('/check/:id/exists', recipientController.exists);
router.get('/:id', recipientController.getById);
router.put('/:id', recipientController.update);
router.delete('/:id', recipientController.delete);

module.exports = router;
