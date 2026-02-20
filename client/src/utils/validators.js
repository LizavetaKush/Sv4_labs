// Валидаторы для форм

export const validatePublication = (data) => {
  const errors = {};

  if (!data.index || data.index.trim() === '') {
    errors.index = 'Индекс издания обязателен';
  } else if (data.index.length > 20) {
    errors.index = 'Индекс не должен превышать 20 символов';
  }

  if (!data.type) {
    errors.type = 'Вид издания обязателен';
  } else if (!['газета', 'журнал'].includes(data.type)) {
    errors.type = 'Вид издания должен быть "газета" или "журнал"';
  }

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Название издания обязательно';
  } else if (data.title.length > 200) {
    errors.title = 'Название не должно превышать 200 символов';
  }

  if (!data.monthlyPrice || data.monthlyPrice === '') {
    errors.monthlyPrice = 'Стоимость подписки обязательна';
  } else {
    const price = parseFloat(data.monthlyPrice);
    if (isNaN(price) || price < 0) {
      errors.monthlyPrice = 'Стоимость должна быть положительным числом';
    }
  }

  return errors;
};

export const validateRecipient = (data) => {
  const errors = {};

  if (!data.code || data.code.trim() === '') {
    errors.code = 'Код получателя обязателен';
  } else if (data.code.length > 20) {
    errors.code = 'Код не должен превышать 20 символов';
  }

  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'ФИО получателя обязательно';
  } else if (data.fullName.length > 200) {
    errors.fullName = 'ФИО не должно превышать 200 символов';
  }

  if (!data.street || data.street.trim() === '') {
    errors.street = 'Улица обязательна';
  } else if (data.street.length > 100) {
    errors.street = 'Улица не должна превышать 100 символов';
  }

  if (!data.house || data.house.trim() === '') {
    errors.house = 'Дом обязателен';
  } else if (data.house.length > 20) {
    errors.house = 'Дом не должен превышать 20 символов';
  }

  if (data.apartment && data.apartment.length > 20) {
    errors.apartment = 'Квартира не должна превышать 20 символов';
  }

  return errors;
};

export const validateSubscription = (data) => {
  const errors = {};

  if (!data.recipientId) {
    errors.recipientId = 'Получатель обязателен';
  }

  if (!data.publicationId) {
    errors.publicationId = 'Издание обязательно';
  }

  if (!data.duration) {
    errors.duration = 'Срок подписки обязателен';
  } else if (![1, 3, 6].includes(parseInt(data.duration))) {
    errors.duration = 'Срок подписки должен быть 1, 3 или 6 месяцев';
  }

  if (!data.startMonth) {
    errors.startMonth = 'Месяц начала обязателен';
  } else {
    const month = parseInt(data.startMonth);
    if (isNaN(month) || month < 1 || month > 12) {
      errors.startMonth = 'Месяц должен быть от 1 до 12';
    }
  }

  if (!data.startYear) {
    errors.startYear = 'Год начала обязателен';
  } else {
    const year = parseInt(data.startYear);
    if (isNaN(year) || year < 2000 || year > 2100) {
      errors.startYear = 'Год должен быть от 2000 до 2100';
    }
  }

  return errors;
};
