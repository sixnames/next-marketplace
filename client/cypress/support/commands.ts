import '@iam4x/cypress-graphql-mock';
import 'cypress-file-upload';
import { ME_AS_ADMIN } from '../../config';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getByCy', (testId) => {
  cy.wait(150);
  cy.get(`[data-cy="${testId}"]`);
});

Cypress.Commands.add('selectNthOption', (select, nth) => {
  cy.get(`${select} option:nth-child(${nth})`).as('option');
  cy.get('@option').then((option) => {
    cy.get(select).invoke('val', option.val()).trigger('change');
  });
});

Cypress.Commands.add('selectOptionByTestId', (select, testId) => {
  cy.get(`select[data-cy="${select}"] option[data-cy="option-${testId}"]`).as('option');
  cy.get('@option').then((option) => {
    cy.get(`select[data-cy="${select}"]`).invoke('val', option.val()).trigger('change');
  });
});

Cypress.Commands.add('openMoreNav', () => {
  cy.getByCy('more-nav-trigger').click();
});

Cypress.Commands.add('closeMoreNav', () => {
  cy.getByCy('more-nav-close').click({ force: true });
});

Cypress.Commands.add('visitMoreNavLink', (testId) => {
  cy.getByCy('more-nav-trigger').click();
  cy.getByCy(`more-nav-item-${testId}`).click();
});

Cypress.Commands.add('closeNotification', () => {
  cy.getByCy('close-notification').as('close');
  cy.get('@close').then((close) => {
    close.each(function (_index, item) {
      if (item) {
        item.click();
      }
    });
  });
});

const apiHost = 'http://localhost:4000';

Cypress.Commands.add('createTestData', () => {
  const createTestDataURI = `${apiHost}/create-test-data`;
  cy.request('GET', createTestDataURI);
});

Cypress.Commands.add('clearTestData', () => {
  const clearTestDataURI = `${apiHost}/clear-test-data`;
  cy.request('GET', clearTestDataURI);
});

Cypress.Commands.add(
  'auth',
  ({ email = ME_AS_ADMIN.email, password = ME_AS_ADMIN.password, redirect }) => {
    cy.visit(`/test-sign-in?email=${email}&password=${password}&redirect=${redirect}`);
  },
);
