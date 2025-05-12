const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Создаем директорию для метрик, если её нет
const metricsDir = path.join(__dirname, '..', 'metrics');
fs.ensureDirSync(metricsDir);

// Функция для измерения времени выполнения команды
function measureCommandTime(command, description) {
  console.log(`Выполнение ${description}...`);
  
  const startTime = new Date();
  try {
    execSync(command, { stdio: 'inherit' });
    const endTime = new Date();
    const elapsedTimeMs = endTime - startTime;
    const elapsedTimeSec = elapsedTimeMs / 1000;
    
    console.log(`${description} выполнено за ${elapsedTimeSec.toFixed(2)} сек.`);
    return {
      command,
      description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      elapsedTimeMs,
      elapsedTimeSec: elapsedTimeSec.toFixed(2),
      success: true
    };
  } catch (error) {
    const endTime = new Date();
    const elapsedTimeMs = endTime - startTime;
    const elapsedTimeSec = elapsedTimeMs / 1000;
    
    console.error(`Ошибка при выполнении ${description}: ${error.message}`);
    return {
      command,
      description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      elapsedTimeMs,
      elapsedTimeSec: elapsedTimeSec.toFixed(2),
      success: false,
      error: error.message
    };
  }
}

// Измеряем время полной сборки проекта
const buildResult = measureCommandTime('pnpm -r build', 'полная сборка проекта');

// Сохраняем результаты в JSON файл
const timestamp = new Date().toISOString().replace(/:/g, '-');
const buildMetricsFile = path.join(metricsDir, `build-metrics-${timestamp}.json`);

fs.writeJSONSync(buildMetricsFile, buildResult, { spaces: 2 });
console.log(`Метрики сборки сохранены в ${buildMetricsFile}`);
