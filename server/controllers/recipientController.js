const { Recipient, Subscription } = require('../models');
const { Op } = require('sequelize');

// Вспомогательная функция для построения запроса
const buildQuery = (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'id',
    sortOrder = 'ASC',
    search,
    street,
    house
  } = queryParams;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const order = [[sortBy, sortOrder.toUpperCase()]];

  const where = {};

  // Поиск по нескольким полям
  if (search) {
    where[Op.or] = [
      { code: { [Op.iLike]: `%${search}%` } },
      { fullName: { [Op.iLike]: `%${search}%` } },
      { street: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Фильтрация по улице
  if (street) {
    where.street = { [Op.iLike]: `%${street}%` };
  }

  // Фильтрация по дому
  if (house) {
    where.house = { [Op.iLike]: `%${house}%` };
  }

  return { where, order, limit: parseInt(limit), offset };
};

// Получить всех получателей
exports.getAll = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const query = buildQuery(req.query);

    const { count, rows } = await Recipient.findAndCountAll(query);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        totalPages: Math.ceil(count / (parseInt(limit) || 10))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка получателей',
      error: error.message
    });
  }
};

// Получить получателя по ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id, {
      include: [{
        model: Subscription,
        as: 'subscriptions'
      }]
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }

    res.json({
      success: true,
      data: recipient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении получателя',
      error: error.message
    });
  }
};

// Создать нового получателя
exports.create = async (req, res) => {
  try {
    const recipient = await Recipient.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Получатель успешно создан',
      data: recipient
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: error.errors.map(e => e.message)
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Получатель с таким кодом уже существует'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании получателя',
      error: error.message
    });
  }
};

// Обновить получателя
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }

    await recipient.update(req.body);
    res.json({
      success: true,
      message: 'Получатель успешно обновлен',
      data: recipient
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: error.errors.map(e => e.message)
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Получатель с таким кодом уже существует'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении получателя',
      error: error.message
    });
  }
};

// Удалить получателя
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }

    // Проверка наличия подписок
    const subscriptionsCount = await Subscription.count({
      where: { recipientId: id }
    });

    if (subscriptionsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Невозможно удалить получателя, у которого есть подписки'
      });
    }

    await recipient.destroy();
    res.json({
      success: true,
      message: 'Получатель успешно удален'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении получателя',
      error: error.message
    });
  }
};

// Проверить существование получателя
exports.exists = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Recipient.findByPk(id) !== null;
    res.json({
      success: true,
      exists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при проверке существования получателя',
      error: error.message
    });
  }
};
