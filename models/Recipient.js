const mongoose = require('mongoose');
const validator = require('validator');

const recipientSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Код получателя обязателен'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]+$/i.test(v) && v.length >= 3;
      },
      message: 'Код получателя должен содержать минимум 3 символа (буквы и цифры)'
    }
  },
  fullName: {
    type: String,
    required: [true, 'Ф.И.О. получателя обязательно'],
    trim: true,
    validate: {
      validator: function(v) {
        const words = v.trim().split(/\s+/);
        return words.length >= 2 && words.every(word => word.length >= 2);
      },
      message: 'Ф.И.О. должно содержать минимум 2 слова, каждое не менее 2 символов'
    },
    minlength: [5, 'Ф.И.О. должно содержать минимум 5 символов'],
    maxlength: [100, 'Ф.И.О. не должно превышать 100 символов']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Улица обязательна'],
      trim: true,
      minlength: [2, 'Название улицы должно содержать минимум 2 символа'],
      maxlength: [100, 'Название улицы не должно превышать 100 символов']
    },
    house: {
      type: String,
      required: [true, 'Номер дома обязателен'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^[0-9А-ЯA-Z\-]+$/i.test(v);
        },
        message: 'Номер дома должен содержать только цифры, буквы и дефисы'
      }
    },
    apartment: {
      type: String,
      required: [true, 'Номер квартиры обязателен'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^[0-9]+[А-ЯA-Z]?$/i.test(v);
        },
        message: 'Номер квартиры должен быть числом или числом с буквой'
      }
    }
  },
  photoUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return validator.isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: 'URL фотографии должен быть валидным HTTP/HTTPS URL'
    }
  }
}, {
  timestamps: true
});

recipientSchema.index({ code: 1 });
recipientSchema.index({ fullName: 'text' });
recipientSchema.index({ 'address.street': 'text' });

recipientSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, д. ${this.address.house}, кв. ${this.address.apartment}`;
});

const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient;
