const Subscription = require('../models/Subscription');
const Recipient = require('../models/Recipient');
const Publication = require('../models/Publication');

exports.createSubscription = async (req, res) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    
    const recipient = await Recipient.findOne({ code: subscription.recipientCode })
      .select('code fullName address')
      .lean();
    const publication = await Publication.findOne({ index: subscription.publicationIndex })
      .select('index title type monthlyPrice')
      .lean();

    const subscriptionObj = subscription.toObject();
    const subscriptionWithPopulated = {
      ...subscriptionObj,
      recipientCode: recipient || subscription.recipientCode,
      publicationIndex: publication || subscription.publicationIndex
    };
    
    res.status(201).json({
      success: true,
      data: subscriptionWithPopulated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      recipientCode,
      publicationIndex,
      duration,
      startMonth,
      startYear,
      minYear,
      maxYear
    } = req.query;

    let query = {};

    if (recipientCode) {
      query.recipientCode = recipientCode;
    }

    if (publicationIndex) {
      query.publicationIndex = publicationIndex;
    }

    if (duration) {
      query.duration = parseInt(duration);
    }

    if (startMonth) {
      query.startMonth = parseInt(startMonth);
    }

    if (startYear) {
      query.startYear = parseInt(startYear);
    } else if (minYear || maxYear) {
      query.startYear = {};
      if (minYear) query.startYear.$gte = parseInt(minYear);
      if (maxYear) query.startYear.$lte = parseInt(maxYear);
    }

    if (search) {
      const recipients = await Recipient.find({
        $or: [
          { code: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      }).select('code');
      
      const publications = await Publication.find({
        $or: [
          { index: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } }
        ]
      }).select('index');

      const recipientCodes = recipients.map(r => r.code);
      const publicationIndices = publications.map(p => p.index);

      const searchConditions = [];
      
      if (recipientCodes.length > 0) {
        searchConditions.push({ recipientCode: { $in: recipientCodes } });
      }
      
      if (publicationIndices.length > 0) {
        searchConditions.push({ publicationIndex: { $in: publicationIndices } });
      }
      
      if (!isNaN(search)) {
        const numSearch = parseInt(search);
        if (numSearch >= 1 && numSearch <= 12) {
          searchConditions.push({ startMonth: numSearch });
        }
        if (numSearch >= 2000 && numSearch <= 2100) {
          searchConditions.push({ startYear: numSearch });
        }
        if ([1, 3, 6].includes(numSearch)) {
          searchConditions.push({ duration: numSearch });
        }
      }
      
      if (searchConditions.length > 0) {
        query.$or = searchConditions;
      }
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const subscriptions = await Subscription.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const recipientCodes = [...new Set(subscriptions.map(s => s.recipientCode))];
    const publicationIndices = [...new Set(subscriptions.map(s => s.publicationIndex))];

    const [recipients, publications] = await Promise.all([
      Recipient.find({ code: { $in: recipientCodes } })
        .select('code fullName address')
        .lean(),
      Publication.find({ index: { $in: publicationIndices } })
        .select('index title type monthlyPrice')
        .lean()
    ]);

    const recipientMap = new Map(recipients.map(r => [r.code, r]));
    const publicationMap = new Map(publications.map(p => [p.index, p]));

    const subscriptionsWithPopulated = subscriptions.map(sub => ({
      ...sub,
      recipientCode: recipientMap.get(sub.recipientCode) || sub.recipientCode,
      publicationIndex: publicationMap.get(sub.publicationIndex) || sub.publicationIndex
    }));

    const total = await Subscription.countDocuments(query);

    res.status(200).json({
      success: true,
      data: subscriptionsWithPopulated,
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

exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).lean();
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }

    const recipient = await Recipient.findOne({ code: subscription.recipientCode })
      .select('code fullName address')
      .lean();
    const publication = await Publication.findOne({ index: subscription.publicationIndex })
      .select('index title type monthlyPrice')
      .lean();

    const subscriptionWithPopulated = {
      ...subscription,
      recipientCode: recipient || subscription.recipientCode,
      publicationIndex: publication || subscription.publicationIndex
    };

    res.status(200).json({
      success: true,
      data: subscriptionWithPopulated
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }

    const recipient = await Recipient.findOne({ code: subscription.recipientCode })
      .select('code fullName address')
      .lean();
    const publication = await Publication.findOne({ index: subscription.publicationIndex })
      .select('index title type monthlyPrice')
      .lean();

    const subscriptionWithPopulated = {
      ...subscription,
      recipientCode: recipient || subscription.recipientCode,
      publicationIndex: publication || subscription.publicationIndex
    };

    res.status(200).json({
      success: true,
      data: subscriptionWithPopulated
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Подписка успешно удалена',
      data: subscription
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Подписка не найдена'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkSubscriptionExists = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Subscription.exists({ _id: id });

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
