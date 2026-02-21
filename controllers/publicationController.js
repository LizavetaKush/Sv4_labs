const Publication = require('../models/Publication');

exports.createPublication = async (req, res) => {
  try {
    const publication = new Publication(req.body);
    await publication.save();
    res.status(201).json({
      success: true,
      data: publication
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPublications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      type,
      minPrice,
      maxPrice
    } = req.query;

    let query = {};

    if (type) {
      query.type = type;
    }

    if (minPrice || maxPrice) {
      query.monthlyPrice = {};
      if (minPrice) query.monthlyPrice.$gte = Number(minPrice);
      if (maxPrice) query.monthlyPrice.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { index: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const publications = await Publication.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Publication.countDocuments(query);

    res.status(200).json({
      success: true,
      data: publications,
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

exports.getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    
    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }

    res.status(200).json({
      success: true,
      data: publication
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }

    res.status(200).json({
      success: true,
      data: publication
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Издание успешно удалено',
      data: publication
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Издание не найдено'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkPublicationExists = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Publication.exists({ _id: id });

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
