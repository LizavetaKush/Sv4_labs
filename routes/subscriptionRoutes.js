const express = require('express');
const router = express.Router();
const {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  checkSubscriptionExists
} = require('../controllers/subscriptionController');

router.post('/', createSubscription);

router.get('/', getSubscriptions);

router.get('/:id/exists', checkSubscriptionExists);

router.get('/:id', getSubscriptionById);

router.put('/:id', updateSubscription);

router.delete('/:id', deleteSubscription);

module.exports = router;
