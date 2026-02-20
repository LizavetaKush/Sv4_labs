const { Subscription, Recipient, Publication } = require('../models');
const { Op } = require('sequelize');

// Вспомогательная функция для построения запроса
const buildQuery = (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'id',
    sortOrder = 'ASC',
    recipientId,
    publicationId,
    duration,
    startMonth,
    startYear,
    minYear,
    maxYear
  } = queryParams;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const order = [[sortBy, sortOrder.toUpperCase()]];

  const where = {};

  // Фильтрация по получателю
  if (recipientId) {
    where.recipientId = recipientId;
  }

  // Фильтрация по изданию
  if (publicationId) {
    where.publicationId = publicationId;
  }

  // Фильтрация по сроку подписки
  if (duration) {
    where.duration = duration;
  }

  // Фильтрация по месяцу начала
  if (startMonth) {
    where.startMonth = startMonth;
  }

  // Фильтрация по году начала
  if (startYear) {
    where.startYear = startYear;
  }

  // Фильтрация по диапазону годов
  if (minYear || maxYear) {
    where.startYear = {};
    if (minYear) {
      where.startYear[Op.gte] = parseInt(minYear);
    }
    if (maxYear) {
      where.startYear[Op.lte] = parseInt(maxYear);
    }
  }

  return { where, order, limit: parseInt(limit), offset };
};

// Получить все подписки
exports.getAll = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const query = buildQuery(req.query);

    const { count, rows } = await Subscription.findAndCountAll({
      ...query,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'code', 'fullName']
        },
        {
          model: Publication,
          as: 'publication',
          attributes: ['id', 'index', 'title', 'type']
        }
      ]
    });

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
      message: 'Ошибка при получении списка подписок',
      error: error.message
    });
  }
};

// Получить подписку по ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'recipient'
        },
        {
          model: Publication,
          as: 'publication'
        }
      ]
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении подписки',
      error: error.message
    });
  }
};

// Создать новую подписку
exports.create = async (req, res) => {
  try {
    // Проверка существования получателя
    const recipient = await Recipient.findByPk(req.body.recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }

    // Проверка существования издания
    const publication = await Publication.findByPk(req.body.publicationId);
    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }

    const subscription = await Subscription.create(req.body);
    
    // Загружаем связанные данные для ответа
    const subscriptionWithRelations = await Subscription.findByPk(subscription.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient'
        },
        {
          model: Publication,
          as: 'publication'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Подписка успешно создана',
      data: subscriptionWithRelations
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: error.errors.map(e => e.message)
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Ошибка внешнего ключа: получатель или издание не найдены'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании подписки',
      error: error.message
    });
  }
};

// Обновить подписку
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }

    // Проверка существования получателя, если он изменяется
    if (req.body.recipientId) {
      const recipient = await Recipient.findByPk(req.body.recipientId);
      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: 'Получатель не найден'
        });
      }
    }

    // Проверка существования издания, если оно изменяется
    if (req.body.publicationId) {
      const publication = await Publication.findByPk(req.body.publicationId);
      if (!publication) {
        return res.status(404).json({
          success: false,
          message: 'Издание не найдено'
        });
      }
    }

    await subscription.update(req.body);
    
    // Загружаем связанные данные для ответа
    const subscriptionWithRelations = await Subscription.findByPk(subscription.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient'
        },
        {
          model: Publication,
          as: 'publication'
        }
      ]
    });

    res.json({
      success: true,
      message: 'Подписка успешно обновлена',
      data: subscriptionWithRelations
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: error.errors.map(e => e.message)
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Ошибка внешнего ключа: получатель или издание не найдены'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении подписки',
      error: error.message
    });
  }
};

// Удалить подписку
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }

    await subscription.destroy();
    res.json({
      success: true,
      message: 'Подписка успешно удалена'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении подписки',
      error: error.message
    });
  }
};

// Проверить существование подписки
exports.exists = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Subscription.findByPk(id) !== null;
    res.json({
      success: true,
      exists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при проверке существования подписки',
      error: error.message
    });
  }
};
