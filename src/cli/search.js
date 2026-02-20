import readline from 'readline';
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

async function searchInFile(filePath, searchTerm) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const product = JSON.parse(content);
    
    const searchLower = searchTerm.toLowerCase();
    const matches = 
      (product.name && product.name.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower)) ||
      (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.id && product.id.includes(searchTerm));

    return matches ? product : null;
  } catch (error) {
    return null;
  }
}

async function performSearch(searchTerm) {
  try {
    const index = await loadIndex();
    
    if (index.length === 0) {
      console.log('База данных пуста');
      return;
    }

    console.log(`\nПоиск по ${index.length} продуктам...\n`);
    const results = [];

    for (const entry of index) {
      const filePath = path.join(DATA_DIR, entry.filename);
      const match = await searchInFile(filePath, searchTerm);
      
      if (match) {
        results.push(match);
      }
    }

    if (results.length === 0) {
      console.log(`По запросу "${searchTerm}" ничего не найдено\n`);
    } else {
      console.log(`Найдено результатов: ${results.length}\n`);
      results.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} (${product.category})`);
        console.log(`   Бренд: ${product.brand}`);
        console.log(`   Цена: ${product.price} руб.`);
        console.log(`   ID: ${product.id}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Ошибка при поиске:', error.message);
  }
}

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Введите критерий поиска (например, название продукта, категория, бренд): ', async (searchTerm) => {
    if (!searchTerm.trim()) {
      console.log('Поисковый запрос не может быть пустым');
      rl.close();
      return;
    }

    await performSearch(searchTerm.trim());
    rl.close();
  });
}

main();
