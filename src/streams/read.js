import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readLargeFile(filePath) {
  return new Promise((resolve, reject) => {
    const readableStream = fs.createReadStream(filePath, { 
      encoding: 'utf-8',
      highWaterMark: 64 * 1024 // 64KB chunks
    });

    let data = '';
    let lineCount = 0;
    let chunkCount = 0;

    readableStream.on('data', (chunk) => {
      chunkCount++;
      data += chunk;
      const lines = chunk.split('\n').length - 1;
      lineCount += lines;
      
      // Выводим прогресс каждые 10 чанков
      if (chunkCount % 10 === 0) {
        process.stdout.write(`\rПрочитано чанков: ${chunkCount}, строк: ${lineCount}`);
      }
    });

    readableStream.on('end', () => {
      console.log(`\n\nЧтение завершено. Всего чанков: ${chunkCount}, строк: ${lineCount}`);
      resolve(data);
    });

    readableStream.on('error', (error) => {
      console.error('\nОшибка при чтении файла:', error.message);
      reject(error);
    });
  });
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node read.js <путь_к_файлу>');
  console.error('Пример: node read.js ../../data/product_index.json');
  process.exit(1);
}

const [filePath] = args;
const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, filePath);

readLargeFile(absolutePath)
  .then(() => {
    console.log('Файл успешно прочитан');
  })
  .catch((error) => {
    console.error('Ошибка:', error.message);
    process.exit(1);
  });
