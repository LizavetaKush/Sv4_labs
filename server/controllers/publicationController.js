const { Publication } = require('../models');
const { Op } = require('sequelize');

// Вспомогательная функция для построения запроса с фильтрацией, поиском и сортировкой
const buildQuery = (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'id',
    sortOrder = 'ASC',
    search,
    type,
    minPrice,
    maxPrice
  } = queryParams;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const order = [[sortBy, sortOrder.toUpperCase()]];

  const where = {};

  // Поиск по нескольким полям
  if (search) {
    where[Op.or] = [
      { index: { [Op.iLike]: `%${search}%` } },
      { title: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Фильтрация по виду издания
  if (type) {
    where.type = type;
  }

  // Фильтрация по цене
  if (minPrice || maxPrice) {
    where.monthlyPrice = {};
    if (minPrice) {
      where.monthlyPrice[Op.gte] = parseFloat(minPrice);
    }
    if (maxPrice) {
      where.monthlyPrice[Op.lte] = parseFloat(maxPrice);
    }
  }

  return { where, order, limit: parseInt(limit), offset };
};

// Получить все издания с пагинацией, сортировкой, фильтрацией и поиском
exports.getAll = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const query = buildQuery(req.query);

    const { count, rows } = await Publication.findAndCountAll(query);

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
      message: 'Ошибка при получении списка изданий',
      error: error.message
    });
  }
};

// Получить издание по ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }

    res.json({
      success: true,
      data: publication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении издания',
      error: error.message
    });
  }
};

// Создать новое издание
exports.create = async (req, res) => {
  try {
    const publication = await Publication.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Издание успешно создано',
      data: publication
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
        message: 'Издание с таким индексом уже существует'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании издания',
      error: error.message
    });
  }
};

// Обновить издание
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }

    await publication.update(req.body);
    res.json({
      success: true,
      message: 'Издание успешно обновлено',
      data: publication
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
        message: 'Издание с таким индексом уже существует'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении издания',
      error: error.message
    });
  }
};

// Удалить издание
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }

    await publication.destroy();
    res.json({
      success: true,
      message: 'Издание успешно удалено'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении издания',
      error: error.message
    });
  }
};

// Проверить существование издания
exports.exists = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Publication.findByPk(id) !== null;
    res.json({
      success: true,
      exists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при проверке существования издания',
      error: error.message
    });
  }
};
