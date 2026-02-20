const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../models');
const nodemailer = require('nodemailer');

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Настройка транспорта для отправки email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Регистрация
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Валидация
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны для заполнения'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Пароль должен быть не менее 6 символов'
      });
    }

    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Создание пользователя
    const user = await User.create({
      email,
      password,
      fullName,
      role: role || 'user'
    });

    // Генерация токена
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при регистрации',
      error: error.message
    });
  }
};

// Авторизация
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email и пароль обязательны'
      });
    }

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Проверка активности
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Аккаунт деактивирован'
      });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }

    // Генерация токена
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Успешная авторизация',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при авторизации',
      error: error.message
    });
  }
};

// Получение текущего пользователя
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных пользователя',
      error: error.message
    });
  }
};

// Смена пароля
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Валидация
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Текущий и новый пароль обязательны'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Новый пароль должен быть не менее 6 символов'
      });
    }

    // Получение пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    // Проверка текущего пароля
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверный текущий пароль'
      });
    }

    // Обновление пароля
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Пароль успешно изменен'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при смене пароля',
      error: error.message
    });
  }
};

// Запрос на восстановление пароля
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email обязателен'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Для безопасности не сообщаем, что пользователь не найден
      return res.json({
        success: true,
        message: 'Если пользователь с таким email существует, на него отправлено письмо с инструкциями'
      });
    }

    // Генерация токена для сброса пароля
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Токен действителен 1 час

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Отправка email (если настроен SMTP)
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: user.email,
          subject: 'Восстановление пароля',
          html: `
            <h2>Восстановление пароля</h2>
            <p>Вы запросили восстановление пароля для вашего аккаунта.</p>
            <p>Для сброса пароля перейдите по ссылке:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Ссылка действительна в течение 1 часа.</p>
            <p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
          `
        });
      } catch (emailError) {
        console.error('Ошибка отправки email:', emailError);
        // Продолжаем выполнение, даже если email не отправлен
      }
    }

    res.json({
      success: true,
      message: 'Если пользователь с таким email существует, на него отправлено письмо с инструкциями',
      // В режиме разработки можно вернуть токен
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при запросе восстановления пароля',
      error: error.message
    });
  }
};

// Сброс пароля по токену
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Токен и новый пароль обязательны'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Пароль должен быть не менее 6 символов'
      });
    }

    // Хеширование токена для поиска
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Поиск пользователя по токену
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Недействительный или истекший токен'
      });
    }

    // Обновление пароля
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Пароль успешно сброшен'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при сбросе пароля',
      error: error.message
    });
  }
};
