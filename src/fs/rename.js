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

async function renameFile(oldFilename, newFilename) {
  try {
    const oldPath = path.isAbsolute(oldFilename) 
      ? oldFilename 
      : path.join(DATA_DIR, oldFilename);
    const newPath = path.isAbsolute(newFilename)
      ? newFilename
      : path.join(DATA_DIR, newFilename);

    // Проверяем существование старого файла
    try {
      await fs.access(oldPath);
    } catch (error) {
      throw new Error(`Файл не найден: ${oldFilename}`);
    }

    // Проверяем, не существует ли уже файл с новым именем
    try {
      await fs.access(newPath);
      throw new Error(`Файл с именем ${newFilename} уже существует`);
    } catch (error) {
      if (error.message.includes('уже существует')) {
        throw error;
      }
      // Файл не существует, продолжаем
    }

    // Переименовываем файл
    await fs.rename(oldPath, newPath);
    console.log(`Файл переименован: ${oldFilename} -> ${newFilename}`);

    // Обновляем индекс, если файл находится в data директории
    if (oldPath.startsWith(DATA_DIR) && newPath.startsWith(DATA_DIR)) {
      const index = await loadIndex();
      const oldBasename = path.basename(oldFilename);
      const entry = index.find(e => e.filename === oldBasename);
      
      if (entry) {
        entry.filename = path.basename(newFilename);
        await saveIndex(index);
        console.log('Индекс обновлен');
      }
    }
  } catch (error) {
    console.error('Ошибка при переименовании файла:', error.message);
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Использование: node rename.js <старое_имя> <новое_имя>');
  console.error('Пример: node rename.js product_1234567890.json product_1234567890_fixed.json');
  process.exit(1);
}

const [oldFilename, newFilename] = args;
renameFile(oldFilename, newFilename);
