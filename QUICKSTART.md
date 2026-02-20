# Быстрый старт

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Настройка базы данных

1. Убедитесь, что PostgreSQL запущен и доступен
2. Создайте файл `.env` в корне проекта:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=subscription_publications
DB_USER=postgres
DB_PASSWORD=ваш_пароль
PORT=5000
```

3. Создайте базу данных:

```bash
npm run db:create
```

Или вручную в PostgreSQL:

```sql
CREATE DATABASE subscription_publications;
```

## Шаг 3: Запуск сервера

```bash
npm run dev
```

Сервер будет доступен по адресу: `http://localhost:5000`

## Шаг 4: Тестирование API

Используйте Postman для тестирования. Примеры запросов см. в файле `POSTMAN_EXAMPLES.md`.

### Быстрая проверка работы API:

1. **Проверка корневого маршрута:**
   ```
   GET http://localhost:5000/
   ```

2. **Создание тестового издания:**
   ```
   POST http://localhost:5000/api/publications
   Content-Type: application/json
   
   {
     "index": "12345",
     "type": "газета",
     "title": "Тестовая газета",
     "monthlyPrice": 15.50
   }
   ```

3. **Получение списка изданий:**
   ```
   GET http://localhost:5000/api/publications
   ```

## Структура проекта

```
server/
├── config/          # Конфигурация БД
├── controllers/     # Контроллеры (бизнес-логика)
├── models/          # Модели Sequelize
├── routes/          # Маршруты API
├── scripts/         # Вспомогательные скрипты
└── index.js         # Точка входа сервера
```

## Основные эндпоинты

- **Издания:** `/api/publications`
- **Получатели:** `/api/recipients`
- **Подписки:** `/api/subscriptions`

Каждый эндпоинт поддерживает:
- `GET /` - список с пагинацией, сортировкой, фильтрацией и поиском
- `GET /:id` - получение по ID
- `POST /` - создание
- `PUT /:id` - обновление
- `DELETE /:id` - удаление
- `GET /check/:id/exists` - проверка существования
