const express = require('express');
const router = express.Router();
const {
  createRecipient,
  getRecipients,
  getRecipientById,
  updateRecipient,
  deleteRecipient,
  checkRecipientExists
} = require('../controllers/recipientController');

router.post('/', createRecipient);

router.get('/', getRecipients);

router.get('/:id/exists', checkRecipientExists);

router.get('/:id', getRecipientById);

router.put('/:id', updateRecipient);

router.delete('/:id', deleteRecipient);

module.exports = router;
