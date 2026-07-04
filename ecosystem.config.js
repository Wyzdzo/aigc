module.exports = {
  apps: [
    {
      name: 'backend-api',
      cwd: './backend',
      script: './dist/bootstraps/api/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Shanghai',
      },
    },
    {
      name: 'backend-worker',
      cwd: './backend',
      script: './dist/bootstraps/worker/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Shanghai',
      },
    },
  ],
};
