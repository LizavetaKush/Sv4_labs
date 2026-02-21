export const validatePublication = (data) => {
  const errors = {}

  if (!data.index || data.index.trim() === '') {
    errors.index = 'Индекс издания обязателен'
  } else if (!/^[A-Z0-9]+$/i.test(data.index)) {
    errors.index = 'Индекс должен содержать только буквы и цифры'
  }

  if (!data.type) {
    errors.type = 'Вид издания обязателен'
  } else if (!['газета', 'журнал'].includes(data.type)) {
    errors.type = 'Вид издания должен быть "газета" или "журнал"'
  }

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Название издания обязательно'
  } else if (data.title.trim().length < 2) {
    errors.title = 'Название должно содержать минимум 2 символа'
  } else if (data.title.trim().length > 200) {
    errors.title = 'Название не должно превышать 200 символов'
  }

  if (!data.monthlyPrice) {
    errors.monthlyPrice = 'Стоимость подписки обязательна'
  } else {
    const price = parseFloat(data.monthlyPrice)
    if (isNaN(price) || price <= 0) {
      errors.monthlyPrice = 'Стоимость должна быть положительным числом'
    }
  }

  if (data.photoUrl && data.photoUrl.trim() !== '') {
    try {
      new URL(data.photoUrl)
      if (!data.photoUrl.startsWith('http://') && !data.photoUrl.startsWith('https://')) {
        errors.photoUrl = 'URL должен начинаться с http:// или https://'
      }
    } catch (e) {
      errors.photoUrl = 'URL фотографии должен быть валидным'
    }
  }

  return errors
}

export const validateRecipient = (data) => {
  const errors = {}

  if (!data.code || data.code.trim() === '') {
    errors.code = 'Код получателя обязателен'
  } else if (!/^[A-Z0-9]+$/i.test(data.code) || data.code.length < 3) {
    errors.code = 'Код должен содержать минимум 3 символа (буквы и цифры)'
  }

  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'Ф.И.О. получателя обязательно'
  } else {
    const words = data.fullName.trim().split(/\s+/)
    if (words.length < 2) {
      errors.fullName = 'Ф.И.О. должно содержать минимум 2 слова'
    } else if (words.some(word => word.length < 2)) {
      errors.fullName = 'Каждое слово должно содержать минимум 2 символа'
    } else if (data.fullName.trim().length < 5) {
      errors.fullName = 'Ф.И.О. должно содержать минимум 5 символов'
    } else if (data.fullName.trim().length > 100) {
      errors.fullName = 'Ф.И.О. не должно превышать 100 символов'
    }
  }

  if (!data.address) {
    errors.address = {}
  } else {
    errors.address = {}

    if (!data.address.street || data.address.street.trim() === '') {
      errors.address.street = 'Улица обязательна'
    } else if (data.address.street.trim().length < 2) {
      errors.address.street = 'Название улицы должно содержать минимум 2 символа'
    }

    if (!data.address.house || data.address.house.trim() === '') {
      errors.address.house = 'Номер дома обязателен'
    } else if (!/^[0-9А-ЯA-Z\-]+$/i.test(data.address.house)) {
      errors.address.house = 'Номер дома должен содержать только цифры, буквы и дефисы'
    }

    if (!data.address.apartment || data.address.apartment.trim() === '') {
      errors.address.apartment = 'Номер квартиры обязателен'
    } else if (!/^[0-9]+[А-ЯA-Z]?$/i.test(data.address.apartment)) {
      errors.address.apartment = 'Номер квартиры должен быть числом или числом с буквой'
    }
  }

  if (data.photoUrl && data.photoUrl.trim() !== '') {
    try {
      new URL(data.photoUrl)
      if (!data.photoUrl.startsWith('http://') && !data.photoUrl.startsWith('https://')) {
        errors.photoUrl = 'URL должен начинаться с http:// или https://'
      }
    } catch (e) {
      errors.photoUrl = 'URL фотографии должен быть валидным'
    }
  }

  return errors
}

export const validateSubscription = (data) => {
  const errors = {}

  if (!data.recipientCode || data.recipientCode.trim() === '') {
    errors.recipientCode = 'Код получателя обязателен'
  }

  if (!data.publicationIndex || data.publicationIndex.trim() === '') {
    errors.publicationIndex = 'Индекс издания обязателен'
  }

  if (!data.duration) {
    errors.duration = 'Срок подписки обязателен'
  } else {
    const duration = parseInt(data.duration)
    if (![1, 3, 6].includes(duration)) {
      errors.duration = 'Срок подписки должен быть 1, 3 или 6 месяцев'
    }
  }

  if (!data.startMonth) {
    errors.startMonth = 'Месяц начала доставки обязателен'
  } else {
    const month = parseInt(data.startMonth)
    if (isNaN(month) || month < 1 || month > 12) {
      errors.startMonth = 'Месяц должен быть от 1 до 12'
    }
  }

  if (!data.startYear) {
    errors.startYear = 'Год начала доставки обязателен'
  } else {
    const year = parseInt(data.startYear)
    if (isNaN(year) || year < 2000 || year > 2100) {
      errors.startYear = 'Год должен быть от 2000 до 2100'
    }
  }

  if (data.photoUrl && data.photoUrl.trim() !== '') {
    try {
      new URL(data.photoUrl)
      if (!data.photoUrl.startsWith('http://') && !data.photoUrl.startsWith('https://')) {
        errors.photoUrl = 'URL должен начинаться с http:// или https://'
      }
    } catch (e) {
      errors.photoUrl = 'URL фотографии должен быть валидным'
    }
  }

  return errors
}
