const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/publications', require('./routes/publicationRoutes'));
app.use('/api/recipients', require('./routes/recipientRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

app.get('/', (req, res) => {
  res.json({
    message: 'API для управления подписными изданиями',
    endpoints: {
      publications: '/api/publications',
      recipients: '/api/recipients',
      subscriptions: '/api/subscriptions'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
