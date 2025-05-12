// Скрипт для интеграции с процессом сборки Next.js и сохранения метрик
const fs = require('fs-extra');
const path = require('path');

// Создаем директорию для метрик, если её нет
const metricsDir = path.join(__dirname, '../../../metrics');
fs.ensureDirSync(metricsDir);

// Проверяем окружение для сбора метрик
if (process.env.MEASURE_BUILD !== 'true') {
  console.log('Пропускаем сбор метрик сборки (MEASURE_BUILD не установлен)');
  process.exit(0);
}

// Записываем метрики сборки
const buildStartTime = process.env.BUILD_START_TIME || new Date().toISOString();
const buildEndTime = new Date().toISOString();
const buildDuration = new Date(buildEndTime) - new Date(buildStartTime);

const buildMetrics = {
  component: 'travel-booking',
  buildStartTime,
  buildEndTime,
  buildDurationMs: buildDuration,
  buildDurationSec: (buildDuration / 1000).toFixed(2),
  environment: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString()
};

// Сохраняем метрики в JSON файл
const timestamp = new Date().toISOString().replace(/:/g, '-');
const buildMetricsFile = path.join(metricsDir, `next-build-metrics-${timestamp}.json`);

fs.writeJSONSync(buildMetricsFile, buildMetrics, { spaces: 2 });
console.log(`Метрики сборки Next.js сохранены в ${buildMetricsFile}`);
console.log(`Время сборки Next.js: ${buildMetrics.buildDurationSec} сек.`);
