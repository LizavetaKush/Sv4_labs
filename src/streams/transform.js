import { Transform } from 'stream';
import { pipeline } from 'stream/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Transform Stream для преобразования формата данных о продуктах
class ProductTransform extends Transform {
  constructor(options = {}) {
    super({ objectMode: true, ...options });
    this.lineNumber = 0;
  }

  _transform(chunk, encoding, callback) {
    try {
      this.lineNumber++;
      const data = chunk.toString().trim();
      
      if (!data) {
        return callback();
      }

      // Пытаемся распарсить JSON
      let product;
      try {
        product = JSON.parse(data);
      } catch (e) {
        // Если не JSON, создаем объект из строки
        product = { raw: data };
      }

      // Преобразуем формат: добавляем префикс, форматируем цену и т.д.
      const transformed = {
        id: `PROD-${product.id || this.lineNumber}`,
        name: product.name ? product.name.toUpperCase() : product.raw,
        category: product.category || 'UNKNOWN',
        brand: product.brand || 'UNKNOWN',
        price: product.price ? `${product.price.toFixed(2)} RUB` : 'N/A',
        description: product.description || '',
        transformedAt: new Date().toISOString()
      };

      // Выводим преобразованные данные
      const output = JSON.stringify(transformed) + '\n';
      this.push(output);
      
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

async function transformData(inputFile, outputFile) {
  try {
    const inputPath = path.isAbsolute(inputFile) 
      ? inputFile 
      : path.resolve(__dirname, inputFile);
    const outputPath = path.isAbsolute(outputFile)
      ? outputFile
      : path.resolve(__dirname, outputFile);

    const readStream = fs.createReadStream(inputPath, { encoding: 'utf-8' });
    const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf-8' });
    const transformStream = new ProductTransform();

    console.log('Начало преобразования данных...');
    
    await pipeline(
      readStream,
      transformStream,
      writeStream
    );

    console.log(`Преобразование завершено. Результат сохранен в: ${outputFile}`);
  } catch (error) {
    console.error('Ошибка при преобразовании данных:', error.message);
    process.exit(1);
  }
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length >= 2) {
  // Если указаны входной и выходной файлы
  const [inputFile, outputFile] = args;
  transformData(inputFile, outputFile);
} else {
  // Если аргументы не указаны, читаем из stdin
  console.log('Чтение данных из stdin. Введите данные (Ctrl+D или Ctrl+Z для завершения):\n');
  
  const transformStream = new ProductTransform();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  transformStream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  transformStream.on('end', () => {
    console.log('\nПреобразование завершено');
    process.exit(0);
  });

  rl.on('line', (line) => {
    transformStream.write(line + '\n');
  });

  rl.on('close', () => {
    transformStream.end();
  });
}
