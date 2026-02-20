# Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
# База данных
DB_HOST=localhost
DB_PORT=5432
DB_NAME=subscription_publications
DB_USER=postgres
DB_PASSWORD=your_password

# Сервер
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# SMTP для отправки email (опционально, для восстановления пароля)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# URL фронтенда (для ссылок восстановления пароля)
FRONTEND_URL=http://localhost:3000
```

## Примечания

- **JWT_SECRET**: Используйте сложный случайный ключ в продакшене
- **SMTP**: Настройка опциональна. Если не настроена, восстановление пароля будет работать, но email не будет отправляться (токен можно получить в ответе в режиме development)
- **FRONTEND_URL**: URL вашего фронтенд приложения для генерации ссылок восстановления пароля
