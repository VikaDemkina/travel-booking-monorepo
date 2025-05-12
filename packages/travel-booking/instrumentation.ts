export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const startTime = new Date();
    
    // Сохраняем время начала сборки в переменную окружения
    if (process.env.MEASURE_BUILD === 'true' && process.env.NODE_ENV === 'production') {
      process.env.BUILD_START_TIME = startTime.toISOString();
      console.log(`[Metrics] Старт сборки: ${process.env.BUILD_START_TIME}`);
    }
  }
}
