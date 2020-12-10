require('dotenv').config();

module.exports = () => {
  return {
    devIndicators: {
      autoPrerender: false,
    },
    env: {
      API_HOST: process.env.API_HOST,
      ENV: process.env.ENV,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
  };
};
