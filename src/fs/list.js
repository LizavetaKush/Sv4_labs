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

async function listProducts() {
  try {
    const index = await loadIndex();

    if (index.length === 0) {
      console.log('Список продуктов пуст');
      return;
    }

    console.log('\n=== Список всех продуктов ===\n');
    index.forEach((entry, index) => {
      console.log(`${index + 1}. ID: ${entry.id}`);
      console.log(`   Название: ${entry.name}`);
      console.log(`   Категория: ${entry.category}`);
      console.log(`   Бренд: ${entry.brand}`);
      console.log(`   Цена: ${entry.price} руб.`);
      console.log(`   Файл: ${entry.filename}`);
      console.log('');
    });

    console.log(`Всего продуктов: ${index.length}`);
  } catch (error) {
    console.error('Ошибка при получении списка продуктов:', error.message);
    process.exit(1);
  }
}

listProducts();
