const mongoose = require('mongoose');
const validator = require('validator');

const publicationSchema = new mongoose.Schema({
  index: {
    type: String,
    required: [true, 'Индекс издания обязателен'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]+$/i.test(v);
      },
      message: 'Индекс издания должен содержать только буквы и цифры'
    }
  },
  type: {
    type: String,
    required: [true, 'Вид издания обязателен'],
    enum: {
      values: ['газета', 'журнал'],
      message: 'Вид издания должен быть либо "газета", либо "журнал"'
    }
  },
  title: {
    type: String,
    required: [true, 'Название издания обязательно'],
    trim: true,
    minlength: [2, 'Название издания должно содержать минимум 2 символа'],
    maxlength: [200, 'Название издания не должно превышать 200 символов']
  },
  monthlyPrice: {
    type: Number,
    required: [true, 'Стоимость подписки на месяц обязательна'],
    min: [0, 'Стоимость подписки не может быть отрицательной'],
    validate: {
      validator: function(v) {
        return v > 0 && Number.isFinite(v);
      },
      message: 'Стоимость подписки должна быть положительным числом'
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

publicationSchema.index({ index: 1 });
publicationSchema.index({ type: 1 });
publicationSchema.index({ title: 'text' });

const Publication = mongoose.model('Publication', publicationSchema);

module.exports = Publication;
