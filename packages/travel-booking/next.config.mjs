/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    // Вы можете добавить здесь дополнительные настройки webpack
    
    // Добавляем хук для метрик сборки вместо onBuildComplete
    if (isServer && process.env.MEASURE_BUILD === 'true') {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.done.tap('BuildMetrics', () => {
            try {
              // Вызываем скрипт для сохранения метрик через child_process
              const { execSync } = require('child_process');
              execSync('node scripts/next-build-hook.js', { stdio: 'inherit' });
            } catch (error) {
              console.error('Ошибка при выполнении build hook:', error);
            }
          });
        },
      });
    }
    
    return config;
  },
  eslint: {
    // Отключаем проверку ESLint во время сборки для ускорения процесса
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
