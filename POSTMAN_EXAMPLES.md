# Примеры запросов для Postman

Базовый URL: `http://localhost:5000/api`

## Издания (Publications)

### 1. Создание издания
**POST** `/api/publications`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "index": "12345",
  "type": "газета",
  "title": "Советская Белоруссия",
  "monthlyPrice": 15.50
}
```

### 2. Получение всех изданий
**GET** `/api/publications`

### 3. Получение изданий с пагинацией
**GET** `/api/publications?page=1&limit=5`

### 4. Получение изданий с сортировкой
**GET** `/api/publications?sortBy=title&sortOrder=ASC`

### 5. Поиск изданий
**GET** `/api/publications?search=газета`

### 6. Фильтрация по виду издания
**GET** `/api/publications?type=журнал`

### 7. Фильтрация по цене
**GET** `/api/publications?minPrice=10&maxPrice=50`

### 8. Комбинированная фильтрация и поиск
**GET** `/api/publications?type=газета&minPrice=10&maxPrice=30&sortBy=monthlyPrice&sortOrder=ASC`

### 9. Получение издания по ID
**GET** `/api/publications/1`

### 10. Обновление издания
**PUT** `/api/publications/1`

**Body (raw JSON):**
```json
{
  "title": "Новое название газеты",
  "monthlyPrice": 20.00
}
```

### 11. Удаление издания
**DELETE** `/api/publications/1`

### 12. Проверка существования издания
**GET** `/api/publications/check/1/exists`

---

## Получатели (Recipients)

### 1. Создание получателя
**POST** `/api/recipients`

**Body (raw JSON):**
```json
{
  "code": "R001",
  "fullName": "Иванов Иван Иванович",
  "street": "ул. Ленина",
  "house": "10",
  "apartment": "25"
}
```

### 2. Получение всех получателей
**GET** `/api/recipients`

### 3. Получение получателей с пагинацией
**GET** `/api/recipients?page=1&limit=10`

### 4. Поиск получателей
**GET** `/api/recipients?search=Иванов`

### 5. Фильтрация по улице
**GET** `/api/recipients?street=Ленина`

### 6. Фильтрация по дому
**GET** `/api/recipients?house=10`

### 7. Комбинированная фильтрация
**GET** `/api/recipients?street=Ленина&house=10&sortBy=fullName&sortOrder=ASC`

### 8. Получение получателя по ID (с подписками)
**GET** `/api/recipients/1`

### 9. Обновление получателя
**PUT** `/api/recipients/1`

**Body (raw JSON):**
```json
{
  "fullName": "Петров Петр Петрович",
  "apartment": "30"
}
```

### 10. Удаление получателя
**DELETE** `/api/recipients/1`

**Примечание:** Вернет ошибку, если у получателя есть подписки.

### 11. Проверка существования получателя
**GET** `/api/recipients/check/1/exists`

---

## Подписки (Subscriptions)

### 1. Создание подписки
**POST** `/api/subscriptions`

**Body (raw JSON):**
```json
{
  "recipientId": 1,
  "publicationId": 1,
  "duration": 6,
  "startMonth": 1,
  "startYear": 2024
}
```

### 2. Получение всех подписок
**GET** `/api/subscriptions`

### 3. Получение подписок с пагинацией
**GET** `/api/subscriptions?page=1&limit=10`

### 4. Фильтрация по получателю
**GET** `/api/subscriptions?recipientId=1`

### 5. Фильтрация по изданию
**GET** `/api/subscriptions?publicationId=1`

### 6. Фильтрация по сроку подписки
**GET** `/api/subscriptions?duration=6`

### 7. Фильтрация по году начала
**GET** `/api/subscriptions?startYear=2024`

### 8. Фильтрация по месяцу начала
**GET** `/api/subscriptions?startMonth=1`

### 9. Фильтрация по диапазону годов
**GET** `/api/subscriptions?minYear=2023&maxYear=2024`

### 10. Комбинированная фильтрация
**GET** `/api/subscriptions?recipientId=1&duration=6&startYear=2024&sortBy=startMonth&sortOrder=ASC`

### 11. Получение подписки по ID
**GET** `/api/subscriptions/1`

### 12. Обновление подписки
**PUT** `/api/subscriptions/1`

**Body (raw JSON):**
```json
{
  "duration": 3,
  "startMonth": 6,
  "startYear": 2024
}
```

### 13. Удаление подписки
**DELETE** `/api/subscriptions/1`

### 14. Проверка существования подписки
**GET** `/api/subscriptions/check/1/exists`

---

## Примеры тестовых данных

### Создание нескольких изданий:
```json
[
  {
    "index": "12345",
    "type": "газета",
    "title": "Советская Белоруссия",
    "monthlyPrice": 15.50
  },
  {
    "index": "67890",
    "type": "журнал",
    "title": "Белорусская нива",
    "monthlyPrice": 25.00
  },
  {
    "index": "11111",
    "type": "газета",
    "title": "Комсомольская правда",
    "monthlyPrice": 12.00
  }
]
```

### Создание нескольких получателей:
```json
[
  {
    "code": "R001",
    "fullName": "Иванов Иван Иванович",
    "street": "ул. Ленина",
    "house": "10",
    "apartment": "25"
  },
  {
    "code": "R002",
    "fullName": "Петров Петр Петрович",
    "street": "пр. Победителей",
    "house": "5",
    "apartment": "12"
  },
  {
    "code": "R003",
    "fullName": "Сидоров Сидор Сидорович",
    "street": "ул. Независимости",
    "house": "15",
    "apartment": "8"
  }
]
```

### Создание нескольких подписок:
```json
[
  {
    "recipientId": 1,
    "publicationId": 1,
    "duration": 6,
    "startMonth": 1,
    "startYear": 2024
  },
  {
    "recipientId": 1,
    "publicationId": 2,
    "duration": 3,
    "startMonth": 3,
    "startYear": 2024
  },
  {
    "recipientId": 2,
    "publicationId": 1,
    "duration": 1,
    "startMonth": 6,
    "startYear": 2024
  }
]
```

---

## Примеры ошибок

### Ошибка валидации (400):
```json
{
  "success": false,
  "message": "Ошибка валидации",
  "errors": [
    "Срок подписки должен быть 1, 3 или 6 месяцев"
  ]
}
```

### Запись не найдена (404):
```json
{
  "success": false,
  "message": "Издание не найдено"
}
```

### Ошибка уникальности (400):
```json
{
  "success": false,
  "message": "Издание с таким индексом уже существует"
}
```
