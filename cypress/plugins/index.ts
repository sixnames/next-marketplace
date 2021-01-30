/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
require('dotenv').config();

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  // env variables
  config.env.adminEmail = process.env.ADMIN_EMAIL;
  config.env.adminPassword = process.env.ADMIN_PASSWORD;
  config.env.testDataKey = process.env.TEST_DATA_KEY;
  config.env.initialDataKey = process.env.INITIAL_DATA_KEY;

  on('task', {
    // Define task functions
  });

  return config;
};
