const fs = require('fs-extra');
const path = require('path');

// Создаем директорию для метрик, если её нет
const metricsDir = path.join(__dirname, '..', 'metrics');
fs.ensureDirSync(metricsDir);

// Получаем аргументы из командной строки
const [, , commitSha, commitTime, deployStartTime] = process.argv;
const deployEndTime = new Date().toISOString();

// Функция для расчета длительности между двумя датами в миллисекундах
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return end - start;
}

// Расчет времени деплоя
const deploymentDuration = calculateDuration(deployStartTime, deployEndTime);

// Расчет времени от коммита до завершения деплоя
const commitToDeployDuration = calculateDuration(commitTime, deployEndTime);

// Создаем объект метрик
const deploymentMetrics = {
  commitSha,
  commitTime,
  deployStartTime,
  deployEndTime,
  deploymentDurationMs: deploymentDuration,
  deploymentDurationSec: (deploymentDuration / 1000).toFixed(2),
  commitToDeployDurationMs: commitToDeployDuration,
  commitToDeployDurationSec: (commitToDeployDuration / 1000).toFixed(2),
  timestamp: new Date().toISOString()
};

// Сохраняем метрики в JSON файл
const timestamp = new Date().toISOString().replace(/:/g, '-');
const metricsFile = path.join(metricsDir, `deployment-metrics-${timestamp}.json`);

fs.writeJSONSync(metricsFile, deploymentMetrics, { spaces: 2 });
console.log(`Метрики деплоя сохранены в ${metricsFile}`);

// Выводим метрики в консоль для GitHub Actions
console.log('=== Метрики деплоя ===');
console.log(`Коммит: ${commitSha}`);
console.log(`Время от коммита до окончания деплоя: ${deploymentMetrics.commitToDeployDurationSec} сек.`);
console.log(`Время деплоя: ${deploymentMetrics.deploymentDurationSec} сек.`);
