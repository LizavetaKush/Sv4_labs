const express = require('express');
const router = express.Router();
const {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
  checkPublicationExists
} = require('../controllers/publicationController');

router.post('/', createPublication);

router.get('/', getPublications);

router.get('/:id/exists', checkPublicationExists);

router.get('/:id', getPublicationById);

router.put('/:id', updatePublication);

router.delete('/:id', deletePublication);

module.exports = router;
