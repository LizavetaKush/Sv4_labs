const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recipients',
      key: 'id'
    },
    validate: {
      isInt: {
        msg: 'ID получателя должен быть целым числом'
      }
    }
  },
  publicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'publications',
      key: 'id'
    },
    validate: {
      isInt: {
        msg: 'ID издания должен быть целым числом'
      }
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Срок подписки должен быть целым числом'
      },
      isIn: {
        args: [[1, 3, 6]],
        msg: 'Срок подписки должен быть 1, 3 или 6 месяцев'
      }
    }
  },
  startMonth: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Месяц начала должен быть целым числом'
      },
      min: {
        args: [1],
        msg: 'Месяц начала должен быть от 1 до 12'
      },
      max: {
        args: [12],
        msg: 'Месяц начала должен быть от 1 до 12'
      }
    }
  },
  startYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Год начала должен быть целым числом'
      },
      min: {
        args: [2000],
        msg: 'Год начала должен быть не менее 2000'
      },
      max: {
        args: [2100],
        msg: 'Год начала должен быть не более 2100'
      }
    }
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'subscriptions',
  timestamps: false
});

module.exports = Subscription;
