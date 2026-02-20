import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Скрипт для полнотекстового поиска (будет запущен в отдельном процессе)
const SEARCH_SCRIPT = path.join(__dirname, 'search_worker.js');

function performFullTextSearch(searchTerm) {
  return new Promise((resolve, reject) => {
    console.log(`Запуск полнотекстового поиска по запросу: "${searchTerm}"`);
    console.log('Это может занять некоторое время...\n');

    // Запускаем отдельный процесс для поиска
    const searchProcess = spawn('node', [SEARCH_SCRIPT, searchTerm], {
      cwd: __dirname,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    searchProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    searchProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      process.stderr.write(text);
    });

    searchProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\nПоиск завершен успешно');
        resolve(output);
      } else {
        console.error(`\nПроцесс поиска завершился с кодом ${code}`);
        reject(new Error(`Поиск завершился с ошибкой. Код: ${code}`));
      }
    });

    searchProcess.on('error', (error) => {
      console.error('Ошибка при запуске процесса поиска:', error.message);
      reject(error);
    });
  });
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Использование: node spawn.js <поисковый_запрос>');
  console.error('Пример: node spawn.js "электросамокат"');
  process.exit(1);
}

const [searchTerm] = args;
performFullTextSearch(searchTerm)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Ошибка:', error.message);
    process.exit(1);
  });
