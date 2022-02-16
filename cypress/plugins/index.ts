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

import { getDbCollections } from 'db/mongodb';

/**
 * @type {Cypress.PluginConfig}
 */
require('dotenv').config();

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  on('task', {
    getTaskFromDb: async (taskItemId) => {
      const collections = await getDbCollections();
      const tasksCollection = collections.tasksCollection();
      const task = await tasksCollection.findOne({
        itemId: `${taskItemId}`,
      });
      return task;
    },
  });

  return config;
};
