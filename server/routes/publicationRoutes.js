const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');

// CRUD операции
router.get('/', publicationController.getAll);
router.post('/', publicationController.create);
router.get('/check/:id/exists', publicationController.exists);
router.get('/:id', publicationController.getById);
router.put('/:id', publicationController.update);
router.delete('/:id', publicationController.delete);

module.exports = router;
