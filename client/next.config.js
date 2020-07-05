require('dotenv').config();

module.exports = (phase) => {
  return {
    env: {
      // Reference a variable that was defined in the .env file and make it available at Build Time
      NEXT_NODE_ENV: process.env.NEXT_NODE_ENV,
      API_HOST: process.env.API_HOST,
      API_BROWSER_HOST: process.env.API_BROWSER_HOST,
      IN_PROD: phase === 'phase-production-build',
    },
  };
};
