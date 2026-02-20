import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.static('public'));

// Функция для чтения JSON файла с обработкой ошибок
async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    try {
      return JSON.parse(data);
    } catch (parseError) {
      // Если файл поврежден, логируем ошибку и возвращаем пустой массив
      console.error(`Ошибка парсинга JSON файла ${filePath}:`, parseError.message);
      // Пытаемся восстановить файл с пустым массивом
      const defaultData = [];
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Если файл не существует, создаем его с пустым массивом
      const defaultData = [];
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    // При других ошибках (например, проблемы с правами доступа) пробуем продолжить работу
    console.error(`Ошибка чтения файла ${filePath}:`, error.message);
    return [];
  }
}

// Функция для записи JSON файла
async function writeJSONFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw error;
  }
}

// GET-сервис: возвращает веб-страницу с фронтенд-кодом
app.get('/', async (req, res) => {
  try {
    const htmlPath = path.join(__dirname, 'index.html');
    const html = await fs.readFile(htmlPath, 'utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при загрузке страницы', message: error.message });
  }
});

// GET-сервис: возвращает список продуктов в формате JSON
app.get('/api/products', async (req, res) => {
  try {
    const products = await readJSONFile(PRODUCTS_FILE);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при чтении продуктов', message: error.message });
  }
});

// POST-сервис: возвращает обновленный список заказов в формате JSON
app.post('/api/orders/refresh', async (req, res) => {
  try {
    const orders = await readJSONFile(ORDERS_FILE);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при чтении заказов', message: error.message });
  }
});

// POST-сервис: принимает данные нового заказа
app.post('/api/orders', async (req, res) => {
  try {
    const { productId, customerName, customerPhone, quantity } = req.body;

    // Валидация данных
    if (!productId || !customerName || !customerPhone || !quantity) {
      return res.status(400).json({ 
        error: 'Не все обязательные поля заполнены',
        required: ['productId', 'customerName', 'customerPhone', 'quantity']
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Количество должно быть больше 0' });
    }

    // Проверяем существование продукта
    const products = await readJSONFile(PRODUCTS_FILE);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }

    // Проверяем наличие товара на складе
    if (product.stock < quantity) {
      return res.status(400).json({ 
        error: 'Недостаточно товара на складе',
        available: product.stock,
        requested: quantity
      });
    }

    // Создаем новый заказ
    const orders = await readJSONFile(ORDERS_FILE);
    const newOrder = {
      id: Date.now().toString(),
      productId: productId,
      productName: product.name,
      customerName: customerName,
      customerPhone: customerPhone,
      quantity: parseInt(quantity),
      totalPrice: product.price * quantity,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Уменьшаем количество товара на складе
    product.stock -= quantity;

    // Сохраняем изменения
    orders.push(newOrder);
    await writeJSONFile(ORDERS_FILE, orders);
    await writeJSONFile(PRODUCTS_FILE, products);

    res.status(201).json({ 
      message: 'Заказ успешно создан',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании заказа', message: error.message });
  }
});

// DELETE-сервис: удаление заказа
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await readJSONFile(ORDERS_FILE);
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    const order = orders[orderIndex];

    // Возвращаем товар на склад, если заказ еще не выполнен
    if (order.status === 'pending') {
      const products = await readJSONFile(PRODUCTS_FILE);
      const product = products.find(p => p.id === order.productId);
      
      if (product) {
        product.stock += order.quantity;
        await writeJSONFile(PRODUCTS_FILE, products);
      }
    }

    // Удаляем заказ
    orders.splice(orderIndex, 1);
    await writeJSONFile(ORDERS_FILE, orders);

    res.json({ 
      message: 'Заказ успешно удален',
      deletedOrder: order
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении заказа', message: error.message });
  }
});

// Сервис для получения статистики в формате XML/HTML/JSON в зависимости от Accept
app.get('/api/statistics', async (req, res) => {
  try {
    const products = await readJSONFile(PRODUCTS_FILE);
    const orders = await readJSONFile(ORDERS_FILE);

    // Вычисляем статистику
    const statistics = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      productsByCategory: {},
      topProducts: []
    };

    // Группировка по категориям
    products.forEach(product => {
      if (!statistics.productsByCategory[product.category]) {
        statistics.productsByCategory[product.category] = 0;
      }
      statistics.productsByCategory[product.category]++;
    });

    // Топ продуктов по продажам
    const productSales = {};
    orders.forEach(order => {
      if (!productSales[order.productId]) {
        productSales[order.productId] = { id: order.productId, name: order.productName, sales: 0 };
      }
      productSales[order.productId].sales += order.quantity;
    });
    statistics.topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Определяем формат на основе Accept заголовка
    const accept = req.headers.accept || 'application/json';

    if (accept.includes('application/xml') || accept.includes('text/xml')) {
      // XML формат
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<statistics>\n';
      xml += `  <totalProducts>${statistics.totalProducts}</totalProducts>\n`;
      xml += `  <totalOrders>${statistics.totalOrders}</totalOrders>\n`;
      xml += `  <totalRevenue>${statistics.totalRevenue}</totalRevenue>\n`;
      xml += `  <pendingOrders>${statistics.pendingOrders}</pendingOrders>\n`;
      xml += `  <completedOrders>${statistics.completedOrders}</completedOrders>\n`;
      xml += '  <productsByCategory>\n';
      Object.entries(statistics.productsByCategory).forEach(([category, count]) => {
        xml += `    <category name="${category}">${count}</category>\n`;
      });
      xml += '  </productsByCategory>\n';
      xml += '  <topProducts>\n';
      statistics.topProducts.forEach(product => {
        xml += `    <product id="${product.id}" name="${product.name}" sales="${product.sales}"/>\n`;
      });
      xml += '  </topProducts>\n';
      xml += '</statistics>';
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } else if (accept.includes('text/html')) {
      // HTML формат
      let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Статистика</title>';
      html += '<style>body{font-family:Arial;padding:20px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#4CAF50;color:white;}</style>';
      html += '</head><body><h1>Статистика магазина</h1>';
      html += `<table><tr><th>Показатель</th><th>Значение</th></tr>`;
      html += `<tr><td>Всего продуктов</td><td>${statistics.totalProducts}</td></tr>`;
      html += `<tr><td>Всего заказов</td><td>${statistics.totalOrders}</td></tr>`;
      html += `<tr><td>Общая выручка</td><td>${statistics.totalRevenue} руб.</td></tr>`;
      html += `<tr><td>Ожидающие заказы</td><td>${statistics.pendingOrders}</td></tr>`;
      html += `<tr><td>Завершенные заказы</td><td>${statistics.completedOrders}</td></tr>`;
      html += '</table>';
      html += '<h2>Продукты по категориям</h2><ul>';
      Object.entries(statistics.productsByCategory).forEach(([category, count]) => {
        html += `<li>${category}: ${count}</li>`;
      });
      html += '</ul>';
      html += '<h2>Топ-5 продуктов</h2><ol>';
      statistics.topProducts.forEach(product => {
        html += `<li>${product.name} - ${product.sales} продаж</li>`;
      });
      html += '</ol></body></html>';
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else {
      // JSON формат (по умолчанию)
      res.json(statistics);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении статистики', message: error.message });
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера', message: err.message });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log('Приложение готово к работе');
});
