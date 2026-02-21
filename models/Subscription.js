const mongoose = require('mongoose');
const validator = require('validator');

const subscriptionSchema = new mongoose.Schema({
  recipientCode: {
    type: String,
    required: [true, 'Код получателя обязателен'],
    ref: 'Recipient',
    trim: true
  },
  publicationIndex: {
    type: String,
    required: [true, 'Индекс издания обязателен'],
    ref: 'Publication',
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Срок подписки обязателен'],
    enum: {
      values: [1, 3, 6],
      message: 'Срок подписки должен быть 1, 3 или 6 месяцев'
    }
  },
  startMonth: {
    type: Number,
    required: [true, 'Месяц начала доставки обязателен'],
    min: [1, 'Месяц должен быть от 1 до 12'],
    max: [12, 'Месяц должен быть от 1 до 12'],
    validate: {
      validator: Number.isInteger,
      message: 'Месяц должен быть целым числом'
    }
  },
  startYear: {
    type: Number,
    required: [true, 'Год начала доставки обязателен'],
    min: [2000, 'Год должен быть не ранее 2000'],
    max: [2100, 'Год должен быть не позднее 2100'],
    validate: {
      validator: Number.isInteger,
      message: 'Год должен быть целым числом'
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

subscriptionSchema.index({ recipientCode: 1, publicationIndex: 1, startMonth: 1, startYear: 1 });

subscriptionSchema.index({ recipientCode: 1 });
subscriptionSchema.index({ publicationIndex: 1 });
subscriptionSchema.index({ startYear: 1, startMonth: 1 });

subscriptionSchema.pre('save', async function(next) {
  const Recipient = mongoose.model('Recipient');
  const Publication = mongoose.model('Publication');
  
  const recipient = await Recipient.findOne({ code: this.recipientCode });
  if (!recipient) {
    return next(new Error('Получатель с указанным кодом не существует'));
  }
  
  const publication = await Publication.findOne({ index: this.publicationIndex });
  if (!publication) {
    return next(new Error('Издание с указанным индексом не существует'));
  }
  
  next();
});

subscriptionSchema.virtual('endMonth').get(function() {
  let endMonth = this.startMonth + this.duration - 1;
  let endYear = this.startYear;
  if (endMonth > 12) {
    endMonth -= 12;
    endYear += 1;
  }
  return { month: endMonth, year: endYear };
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
