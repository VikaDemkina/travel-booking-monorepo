/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    // Вы можете добавить здесь дополнительные настройки webpack
    return config;
  },
  eslint: {
    // Отключаем проверку ESLint во время сборки для ускорения процесса
    ignoreDuringBuilds: true,
  },
  // Хук, который будет вызван после завершения сборки
  onBuildComplete: async () => {
    if (process.env.MEASURE_BUILD === 'true') {
      try {
        // Вызываем скрипт для сохранения метрик
        const { execSync } = require('child_process');
        execSync('node scripts/next-build-hook.js', { stdio: 'inherit' });
      } catch (error) {
        console.error('Ошибка при выполнении build hook:', error);
      }
    }
  },
};

export default nextConfig;
