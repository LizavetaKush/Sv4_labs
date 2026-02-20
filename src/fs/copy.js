import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyDirectory(source, destination) {
  try {
    // Проверяем существование исходной директории
    try {
      await fs.access(source);
    } catch (error) {
      throw new Error(`Исходная директория не существует: ${source}`);
    }

    // Создаем целевую директорию, если её нет
    await fs.mkdir(destination, { recursive: true });

    // Читаем содержимое исходной директории
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        // Рекурсивно копируем поддиректории
        await copyDirectory(sourcePath, destPath);
      } else {
        // Копируем файлы
        await fs.copyFile(sourcePath, destPath);
        console.log(`Скопирован: ${entry.name}`);
      }
    }

    console.log(`Резервная копия успешно создана: ${destination}`);
  } catch (error) {
    console.error('Ошибка при создании резервной копии:', error.message);
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Использование: node copy.js <исходная_папка> <целевая_папка>');
  console.error('Пример: node copy.js ./data ./backup');
  process.exit(1);
}

const [source, destination] = args;
copyDirectory(source, destination);
