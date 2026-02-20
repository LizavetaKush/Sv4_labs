const { Sequelize } = require('sequelize');
require('dotenv').config();

const createDatabase = async () => {
  const sequelize = new Sequelize(
    'postgres', // Подключаемся к системной БД
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: console.log
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Подключение к PostgreSQL установлено.');

    const dbName = process.env.DB_NAME || 'subscription_publications';
    
    // Проверяем существование базы данных
    const [results] = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );

    if (results.length === 0) {
      await sequelize.query(`CREATE DATABASE "${dbName}"`);
      console.log(`База данных "${dbName}" успешно создана.`);
    } else {
      console.log(`База данных "${dbName}" уже существует.`);
    }

    await sequelize.close();
  } catch (error) {
    console.error('Ошибка при создании базы данных:', error);
    process.exit(1);
  }
};

createDatabase();
