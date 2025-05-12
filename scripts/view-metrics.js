const fs = require('fs-extra');
const path = require('path');

// Путь к директории с метриками
const metricsDir = path.join(__dirname, '..', 'metrics');

// Проверяем, что директория существует
if (!fs.existsSync(metricsDir)) {
  console.error('Директория с метриками не найдена!');
  process.exit(1);
}

// Получаем типы метрик
const readMetricsFiles = (prefix) => {
  const files = fs.readdirSync(metricsDir)
    .filter(file => file.startsWith(prefix))
    .sort((a, b) => {
      const timeA = new Date(a.split('-').slice(2).join('-').replace('.json', ''));
      const timeB = new Date(b.split('-').slice(2).join('-').replace('.json', ''));
      return timeB - timeA;  // Сортировка по убыванию (новые файлы первые)
    });
  
  return files.map(file => {
    try {
      const data = fs.readJSONSync(path.join(metricsDir, file));
      return {
        file,
        timestamp: file.split('-').slice(2).join('-').replace('.json', ''),
        data
      };
    } catch (error) {
      console.error(`Ошибка при чтении файла ${file}:`, error.message);
      return null;
    }
  }).filter(Boolean);
};

// Читаем метрики сборки
const buildMetrics = readMetricsFiles('build-metrics');
console.log('\n=== Метрики времени сборки ===');
if (buildMetrics.length === 0) {
  console.log('Метрики сборки не найдены.');
} else {
  buildMetrics.forEach((metric, index) => {
    console.log(`\n[${index + 1}] ${metric.timestamp}`);
    console.log(`Команда: ${metric.data.command}`);
    console.log(`Время сборки: ${metric.data.elapsedTimeSec} сек.`);
    console.log(`Статус: ${metric.data.success ? 'Успешно' : 'Ошибка'}`);
  });
}

// Читаем метрики деплоя
const deployMetrics = readMetricsFiles('deployment-metrics');
console.log('\n=== Метрики деплоя ===');
if (deployMetrics.length === 0) {
  console.log('Метрики деплоя не найдены.');
} else {
  deployMetrics.forEach((metric, index) => {
    console.log(`\n[${index + 1}] ${metric.timestamp}`);
    console.log(`Commit SHA: ${metric.data.commitSha.substring(0, 8)}`);
    console.log(`Время от коммита до окончания деплоя: ${metric.data.commitToDeployDurationSec} сек.`);
    console.log(`Время деплоя: ${metric.data.deploymentDurationSec} сек.`);
  });
}

// Вывод статистики
if (buildMetrics.length > 0) {
  const avgBuildTime = buildMetrics.reduce((sum, m) => sum + parseFloat(m.data.elapsedTimeSec), 0) / buildMetrics.length;
  console.log(`\nСреднее время сборки: ${avgBuildTime.toFixed(2)} сек.`);
}

if (deployMetrics.length > 0) {
  const avgDeployTime = deployMetrics.reduce((sum, m) => sum + parseFloat(m.data.deploymentDurationSec), 0) / deployMetrics.length;
  const avgCommitToDeployTime = deployMetrics.reduce((sum, m) => sum + parseFloat(m.data.commitToDeployDurationSec), 0) / deployMetrics.length;
  
  console.log(`Среднее время деплоя: ${avgDeployTime.toFixed(2)} сек.`);
  console.log(`Среднее время от коммита до окончания деплоя: ${avgCommitToDeployTime.toFixed(2)} сек.`);
}
