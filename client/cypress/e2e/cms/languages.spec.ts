/// <reference types="cypress" />

import { SECONDARY_LANG } from '../../../config';

const mockNewLanguageName = 'English';
const mockDefaultLanguageName = 'Русский';

describe('Languages', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/languages`);
  });

  after(() => {
    cy.clearTestData();
  });

  it(`Should CRUD languages`, () => {
    // Shouldn't create new language on validation error
    cy.getByCy('language-create').click();
    cy.getByCy('create-language-modal').should('exist');
    cy.getByCy('language-submit').click();
    cy.getByCy('name-error').should('exist');
    cy.getByCy('key-error').should('exist');

    // Should create new language
    cy.getByCy('language-name').clear().type(mockNewLanguageName);
    cy.getByCy('language-key').select(SECONDARY_LANG);
    cy.getByCy('language-submit').click();
    cy.getByCy('create-language-modal').should('not.exist');
    cy.getByCy('success-notification').should('exist');
    cy.getByCy(mockNewLanguageName).should('exist');

    // Should set new language as default
    cy.getByCy(`${mockNewLanguageName}-checkbox`).click();
    cy.getByCy(`${mockNewLanguageName}-checkbox`).should('be.checked');
    cy.getByCy(`${mockDefaultLanguageName}-checkbox`).should('not.be.checked');
    cy.getByCy('success-notification').should('exist');
  });
});
