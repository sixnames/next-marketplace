require('dotenv').config();

module.exports = (phase) => {
  return {
    env: {
      // Reference a variable that was defined in the .env file and make it available at Build Time
      PRODUCTION_API_HOST: process.env.PRODUCTION_API_HOST,
      NEXT_NODE_ENV: process.env.NEXT_NODE_ENV,
      API_HOST: process.env.API_HOST,
      ASSETS_HOST: process.env.ASSETS_HOST,
      API_BROWSER_HOST: process.env.API_BROWSER_HOST,
      NEXT_IN_PROD: phase === 'phase-production-build',
      NEXT_IN_DEV: phase === 'phase-development-server',
      NEXT_PHASE: phase,
    },
  };
};
