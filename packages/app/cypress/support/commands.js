import '@iam4x/cypress-graphql-mock';
import 'cypress-file-upload';
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

const apiURI = 'http://localhost:4000';
const createTestDataURI = `${apiURI}/create-test-data`;
const clearTestDataURI = `${apiURI}/clear-test-data`;
const authRoute = '/test-sign-in';

Cypress.Commands.add('getByCy', (testId) => {
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

Cypress.Commands.add('createTestData', () => {
  cy.request('GET', createTestDataURI);
});

Cypress.Commands.add('clearTestData', () => {
  cy.request('GET', clearTestDataURI);
});

Cypress.Commands.add('auth', ({ email, password, redirect }) => {
  cy.visit(`${authRoute}?email=${email}&password=${password}&redirect=${redirect}`);
  cy.get(`[data-cy="close-notification"]`).click();
});
