const { sequelize, Publication, Recipient, Subscription } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Начало заполнения базы данных тестовыми данными...');

    // Проверка подключения к БД
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено.');

    // Синхронизация моделей с базой данных (создание таблиц, если их нет)
    console.log('Синхронизация моделей с базой данных...');
    await sequelize.sync({ alter: true });
    console.log('Модели синхронизированы.');

    // Очистка таблиц (если они существуют и содержат данные)
    try {
      const subscriptionCount = await Subscription.count();
      const recipientCount = await Recipient.count();
      const publicationCount = await Publication.count();
      
      if (subscriptionCount > 0) {
        await Subscription.destroy({ where: {}, truncate: true, cascade: true });
      }
      if (recipientCount > 0) {
        await Recipient.destroy({ where: {}, truncate: true, cascade: true });
      }
      if (publicationCount > 0) {
        await Publication.destroy({ where: {}, truncate: true, cascade: true });
      }
      console.log('Таблицы очищены');
    } catch (error) {
      // Если возникла ошибка при очистке, продолжаем
      console.log('Продолжаем заполнение базы данных...');
    }

    // Вставка изданий
    const publications = await Publication.bulkCreate([
      { index: '10001', type: 'газета', title: 'Советская Белоруссия', monthlyPrice: 12.50 },
      { index: '10002', type: 'газета', title: 'Белорусская нива', monthlyPrice: 15.00 },
      { index: '10003', type: 'журнал', title: 'Беларуская думка', monthlyPrice: 25.00 },
      { index: '10004', type: 'газета', title: 'Комсомольская правда в Белоруссии', monthlyPrice: 18.00 },
      { index: '10005', type: 'журнал', title: 'Всемирная панорама', monthlyPrice: 30.00 },
      { index: '10006', type: 'газета', title: 'Минский курьер', monthlyPrice: 10.50 },
      { index: '10007', type: 'журнал', title: 'Здоровье', monthlyPrice: 22.00 },
      { index: '10008', type: 'газета', title: 'Вечерний Минск', monthlyPrice: 11.00 },
      { index: '10009', type: 'журнал', title: 'Наука и жизнь', monthlyPrice: 28.00 },
      { index: '10010', type: 'газета', title: 'Народная газета', monthlyPrice: 13.50 },
      { index: '10011', type: 'журнал', title: 'Домашний очаг', monthlyPrice: 20.00 },
      { index: '10012', type: 'газета', title: 'Республика', monthlyPrice: 14.00 },
      { index: '10013', type: 'журнал', title: 'Автомобильный мир', monthlyPrice: 35.00 },
      { index: '10014', type: 'газета', title: 'Звязда', monthlyPrice: 12.00 },
      { index: '10015', type: 'журнал', title: 'Кулинарные рецепты', monthlyPrice: 18.50 },
      { index: '10016', type: 'газета', title: 'Спортивная панорама', monthlyPrice: 16.00 },
      { index: '10017', type: 'журнал', title: 'Мир техники', monthlyPrice: 32.00 },
      { index: '10018', type: 'газета', title: 'Экономическая газета', monthlyPrice: 17.50 },
    ]);

    console.log(`Создано ${publications.length} изданий`);

    // Вставка получателей
    const recipients = await Recipient.bulkCreate([
      { code: 'R001', fullName: 'Иванов Иван Иванович', street: 'ул. Ленина', house: '10', apartment: '25' },
      { code: 'R002', fullName: 'Петров Петр Петрович', street: 'пр. Победителей', house: '5', apartment: '12' },
      { code: 'R003', fullName: 'Сидоров Сидор Сидорович', street: 'ул. Независимости', house: '15', apartment: '8' },
      { code: 'R004', fullName: 'Козлова Мария Сергеевна', street: 'ул. Октябрьская', house: '22', apartment: '45' },
      { code: 'R005', fullName: 'Смирнов Алексей Владимирович', street: 'пр. Дзержинского', house: '8', apartment: '33' },
      { code: 'R006', fullName: 'Новикова Елена Александровна', street: 'ул. Советская', house: '30', apartment: '17' },
      { code: 'R007', fullName: 'Морозов Дмитрий Николаевич', street: 'ул. Карла Маркса', house: '12', apartment: '9' },
      { code: 'R008', fullName: 'Волкова Анна Петровна', street: 'ул. Гагарина', house: '25', apartment: '21' },
      { code: 'R009', fullName: 'Лебедев Сергей Михайлович', street: 'пр. Машерова', house: '18', apartment: '14' },
      { code: 'R010', fullName: 'Соколова Ольга Викторовна', street: 'ул. Богдановича', house: '7', apartment: '6' },
      { code: 'R011', fullName: 'Павлов Андрей Игоревич', street: 'ул. Якуба Коласа', house: '33', apartment: '52' },
      { code: 'R012', fullName: 'Семенова Татьяна Анатольевна', street: 'ул. Калиновского', house: '20', apartment: '38' },
      { code: 'R013', fullName: 'Голубев Максим Олегович', street: 'пр. Рокоссовского', house: '14', apartment: '27' },
      { code: 'R014', fullName: 'Виноградова Ирина Дмитриевна', street: 'ул. Притыцкого', house: '11', apartment: '19' },
      { code: 'R015', fullName: 'Орлов Владимир Сергеевич', street: 'ул. Толбухина', house: '26', apartment: '41' },
      { code: 'R016', fullName: 'Антонова Светлана Васильевна', street: 'ул. Чкалова', house: '9', apartment: '15' },
      { code: 'R017', fullName: 'Федоров Николай Борисович', street: 'ул. Бобруйская', house: '19', apartment: '31' },
    ]);

    console.log(`Создано ${recipients.length} получателей`);

    // Вставка подписок
    const subscriptions = await Subscription.bulkCreate([
      { recipientId: 1, publicationId: 1, duration: 6, startMonth: 1, startYear: 2024 },
      { recipientId: 1, publicationId: 3, duration: 3, startMonth: 2, startYear: 2024 },
      { recipientId: 2, publicationId: 2, duration: 6, startMonth: 1, startYear: 2024 },
      { recipientId: 2, publicationId: 5, duration: 1, startMonth: 3, startYear: 2024 },
      { recipientId: 3, publicationId: 4, duration: 3, startMonth: 1, startYear: 2024 },
      { recipientId: 4, publicationId: 7, duration: 6, startMonth: 2, startYear: 2024 },
      { recipientId: 5, publicationId: 9, duration: 3, startMonth: 1, startYear: 2024 },
      { recipientId: 6, publicationId: 11, duration: 6, startMonth: 2, startYear: 2024 },
      { recipientId: 7, publicationId: 13, duration: 1, startMonth: 3, startYear: 2024 },
      { recipientId: 8, publicationId: 15, duration: 3, startMonth: 1, startYear: 2024 },
      { recipientId: 9, publicationId: 17, duration: 6, startMonth: 2, startYear: 2024 },
      { recipientId: 10, publicationId: 1, duration: 3, startMonth: 3, startYear: 2024 },
      { recipientId: 11, publicationId: 6, duration: 6, startMonth: 1, startYear: 2024 },
      { recipientId: 12, publicationId: 8, duration: 3, startMonth: 2, startYear: 2024 },
      { recipientId: 13, publicationId: 12, duration: 6, startMonth: 1, startYear: 2024 },
      { recipientId: 14, publicationId: 14, duration: 3, startMonth: 3, startYear: 2024 },
      { recipientId: 15, publicationId: 16, duration: 1, startMonth: 2, startYear: 2024 },
      { recipientId: 16, publicationId: 18, duration: 6, startMonth: 1, startYear: 2024 },
      { recipientId: 17, publicationId: 2, duration: 3, startMonth: 2, startYear: 2024 },
      { recipientId: 1, publicationId: 10, duration: 1, startMonth: 4, startYear: 2024 },
    ]);

    console.log(`Создано ${subscriptions.length} подписок`);

    const total = publications.length + recipients.length + subscriptions.length;
    console.log(`\n✅ База данных успешно заполнена!`);
    console.log(`Всего создано записей: ${total}`);
    console.log(`  - Изданий: ${publications.length}`);
    console.log(`  - Получателей: ${recipients.length}`);
    console.log(`  - Подписок: ${subscriptions.length}`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    await sequelize.close();
    process.exit(1);
  }
};

seedDatabase();
