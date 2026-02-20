const sequelize = require('../config/database');
const Publication = require('./Publication');
const Recipient = require('./Recipient');
const Subscription = require('./Subscription');

// Определение связей
Recipient.hasMany(Subscription, {
  foreignKey: 'recipientId',
  as: 'subscriptions'
});

Subscription.belongsTo(Recipient, {
  foreignKey: 'recipientId',
  as: 'recipient'
});

Publication.hasMany(Subscription, {
  foreignKey: 'publicationId',
  as: 'subscriptions'
});

Subscription.belongsTo(Publication, {
  foreignKey: 'publicationId',
  as: 'publication'
});

module.exports = {
  sequelize,
  Publication,
  Recipient,
  Subscription
};
