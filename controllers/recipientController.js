const Recipient = require('../models/Recipient');

exports.createRecipient = async (req, res) => {
  try {
    const recipient = new Recipient(req.body);
    await recipient.save();
    res.status(201).json({
      success: true,
      data: recipient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getRecipients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      code,
      street
    } = req.query;

    let query = {};

    if (code) {
      query.code = { $regex: code, $options: 'i' };
    }

    if (street) {
      query['address.street'] = { $regex: street, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } },
        { 'address.house': { $regex: search, $options: 'i' } },
        { 'address.apartment': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const recipients = await Recipient.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Recipient.countDocuments(query);

    res.status(200).json({
      success: true,
      data: recipients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getRecipientById = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id);
    
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }

    res.status(200).json({
      success: true,
      data: recipient
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateRecipient = async (req, res) => {
  try {
    const recipient = await Recipient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }

    res.status(200).json({
      success: true,
      data: recipient
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteRecipient = async (req, res) => {
  try {
    const recipient = await Recipient.findByIdAndDelete(req.params.id);

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Получатель успешно удален',
      data: recipient
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Получатель не найден'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkRecipientExists = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Recipient.exists({ _id: id });

    res.status(200).json({
      success: true,
      exists: !!exists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
