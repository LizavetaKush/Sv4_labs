import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Writable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function writeDataToFile(filePath, data) {
  return new Promise((resolve, reject) => {
    const writableStream = fs.createWriteStream(filePath, { 
      encoding: 'utf-8',
      flags: 'a' // append mode
    });

    let bytesWritten = 0;

    writableStream.on('finish', () => {
      console.log(`\nЗапись завершена. Всего байт записано: ${bytesWritten}`);
      resolve();
    });

    writableStream.on('error', (error) => {
      console.error('\nОшибка при записи файла:', error.message);
      reject(error);
    });

    // Записываем данные по частям
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const line = JSON.stringify(item) + '\n';
        const written = writableStream.write(line);
        bytesWritten += Buffer.byteLength(line, 'utf-8');
        
        if (!written) {
          writableStream.once('drain', () => {
            console.log(`Записано элементов: ${index + 1}/${data.length}`);
          });
        }
      });
    } else if (typeof data === 'string') {
      const written = writableStream.write(data);
      bytesWritten += Buffer.byteLength(data, 'utf-8');
      
      if (!written) {
        writableStream.once('drain', () => {
          console.log('Данные записаны');
        });
      }
    }

    writableStream.end();
  });
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node write.js <путь_к_файлу> [данные...]');
  console.error('Пример: node write.js ../../data/catalog.txt "Новый продукт 1" "Новый продукт 2"');
  process.exit(1);
}

const [filePath, ...dataArgs] = args;
const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, filePath);

// Если данные переданы как аргументы, используем их
// Иначе можно было бы читать из stdin
const data = dataArgs.length > 0 ? dataArgs : ['Пример данных для записи'];

writeDataToFile(absolutePath, data)
  .then(() => {
    console.log('Данные успешно записаны в файл');
  })
  .catch((error) => {
    console.error('Ошибка:', error.message);
    process.exit(1);
  });
