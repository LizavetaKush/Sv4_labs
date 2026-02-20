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

async function saveIndex(index) {
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

async function deleteProduct(id) {
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
      console.warn(`Файл ${entry.filename} не найден, но запись будет удалена из индекса`);
    }

    // Удаляем файл, если он существует
    try {
      await fs.unlink(filePath);
      console.log(`Файл удален: ${entry.filename}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Удаляем запись из индекса
    const newIndex = index.filter(e => e.id !== id);
    await saveIndex(newIndex);

    console.log(`Продукт с ID ${id} успешно удален`);
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error.message);
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node delete.js <ID_продукта>');
  console.error('Пример: node delete.js 1234567890');
  process.exit(1);
}

const [id] = args;
deleteProduct(id);
