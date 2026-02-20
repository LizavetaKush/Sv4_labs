const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

// Импорт маршрутов
const authRoutes = require('./routes/authRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const recipientRoutes = require('./routes/recipientRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'API для управления подписными изданиями',
    endpoints: {
      auth: '/api/auth',
      publications: '/api/publications',
      recipients: '/api/recipients',
      subscriptions: '/api/subscriptions'
    }
  });
});

// Обработка ошибок 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Подключение к базе данных и запуск сервера
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено успешно.');

    // Синхронизация моделей с базой данных
    await sequelize.sync({ alter: true });
    console.log('Модели синхронизированы с базой данных.');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`API доступно по адресу: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
