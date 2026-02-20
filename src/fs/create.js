import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_FILE = path.join(DATA_DIR, 'product_index.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

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

async function saveIndex(index) {
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

async function createProduct(name, category, brand, price, description) {
  try {
    await ensureDataDir();

    // Генерируем уникальный ID на основе timestamp
    const id = Date.now().toString();
    const filename = `product_${id}.json`;

    // Проверяем, существует ли файл с таким именем
    const filePath = path.join(DATA_DIR, filename);
    try {
      await fs.access(filePath);
      throw new Error('Ошибка операции FS: Запись уже существует');
    } catch (error) {
      if (error.message === 'Ошибка операции FS: Запись уже существует') {
        throw error;
      }
      // Файл не существует, продолжаем
    }

    // Создаем объект продукта
    const product = {
      id: id,
      name: name,
      category: category,
      brand: brand,
      price: parseFloat(price),
      description: description || '',
      createdAt: new Date().toISOString()
    };

    // Сохраняем продукт в файл
    await fs.writeFile(filePath, JSON.stringify(product, null, 2), 'utf-8');

    // Добавляем запись в индекс
    const index = await loadIndex();
    const indexEntry = {
      id: id,
      name: name,
      category: category,
      brand: brand,
      price: parseFloat(price),
      filename: filename
    };
    index.push(indexEntry);
    await saveIndex(index);

    console.log(`Продукт успешно создан: ${filename}`);
    console.log(`ID: ${id}`);
    return { id, filename, product };
  } catch (error) {
    console.error('Ошибка при создании продукта:', error.message);
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 4) {
  console.error('Использование: node create.js "Название" "Категория" "Бренд" "Цена" ["Описание"]');
  console.error('Пример: node create.js "Электросамокат X1" "Электросамокаты" "Xiaomi" "15000" "Мощный самокат"');
  process.exit(1);
}

const [name, category, brand, price, description] = args;
createProduct(name, category, brand, price, description);
