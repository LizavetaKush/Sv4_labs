import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'product_index.json');

async function loadIndex() {
  try {
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function readProduct(id) {
  try {
    const index = await loadIndex();
    const entry = index.find(e => e.id === id);

    if (!entry) {
      throw new Error(`Запись с ID ${id} не найдена`);
    }

    const filePath = path.join(DATA_DIR, entry.filename);

    // Проверяем существование файла
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`Файл ${entry.filename} не найден`);
    }

    // Читаем и выводим данные продукта
    const data = await fs.readFile(filePath, 'utf-8');
    const product = JSON.parse(data);

    console.log('\n=== Подробная информация о продукте ===\n');
    console.log(`ID: ${product.id}`);
    console.log(`Название: ${product.name}`);
    console.log(`Категория: ${product.category}`);
    console.log(`Бренд: ${product.brand}`);
    console.log(`Цена: ${product.price} руб.`);
    console.log(`Описание: ${product.description || 'Нет описания'}`);
    console.log(`Дата создания: ${product.createdAt}`);
    console.log(`Файл: ${entry.filename}`);
    console.log('');
  } catch (error) {
    console.error('Ошибка при чтении продукта:', error.message);
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node read.js <ID_продукта>');
  console.error('Пример: node read.js 1234567890');
  process.exit(1);
}

const [id] = args;
readProduct(id);
