const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publication = sequelize.define('Publication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  index: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Индекс издания не может быть пустым'
      },
      len: {
        args: [1, 20],
        msg: 'Индекс издания должен быть от 1 до 20 символов'
      }
    }
  },
  type: {
    type: DataTypes.ENUM('газета', 'журнал'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['газета', 'журнал']],
        msg: 'Вид издания должен быть "газета" или "журнал"'
      }
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Название издания не может быть пустым'
      },
      len: {
        args: [1, 200],
        msg: 'Название издания должно быть от 1 до 200 символов'
      }
    }
  },
  monthlyPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Стоимость подписки должна быть числом'
      },
      min: {
        args: [0],
        msg: 'Стоимость подписки не может быть отрицательной'
      }
    }
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'publications',
  timestamps: false
});

module.exports = Publication;
