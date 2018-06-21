module.exports = {
  apps : [
    {
      name      : 'motivation-bot',
      script    : 'bin/www',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ]
};
