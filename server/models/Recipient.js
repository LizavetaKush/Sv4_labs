const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipient = sequelize.define('Recipient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Код получателя не может быть пустым'
      },
      len: {
        args: [1, 20],
        msg: 'Код получателя должен быть от 1 до 20 символов'
      }
    }
  },
  fullName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'ФИО получателя не может быть пустым'
      },
      len: {
        args: [1, 200],
        msg: 'ФИО получателя должно быть от 1 до 200 символов'
      }
    }
  },
  street: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Улица не может быть пустой'
      },
      len: {
        args: [1, 100],
        msg: 'Улица должна быть от 1 до 100 символов'
      }
    }
  },
  house: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Дом не может быть пустым'
      },
      len: {
        args: [1, 20],
        msg: 'Дом должен быть от 1 до 20 символов'
      }
    }
  },
  apartment: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'Квартира должна быть до 20 символов'
      }
    }
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'recipients',
  timestamps: false
});

module.exports = Recipient;
