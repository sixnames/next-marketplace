module.exports = {
  apps: [
    {
      name: 'web',
      cwd: ' /home/wp/web/winepoint',
      script: 'yarn',
      args: 'start',
      /*env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },*/
    },
  ],
};
