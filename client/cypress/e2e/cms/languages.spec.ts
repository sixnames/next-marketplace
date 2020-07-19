/// <reference types="cypress" />

import { ISO_LANGUAGES } from '../../../config';

const mockNewLanguageName = ISO_LANGUAGES[0].nameString;
const mockNewLanguageKey = ISO_LANGUAGES[0].id;
const mockUpdatedLanguageName = ISO_LANGUAGES[1].nameString;
const mockUpdatedLanguageKey = ISO_LANGUAGES[1].id;
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
    cy.getByCy('language-key').select(mockNewLanguageKey);
    cy.getByCy('language-submit').click();
    cy.getByCy('create-language-modal').should('not.exist');
    cy.getByCy('success-notification').should('exist');
    cy.getByCy(mockNewLanguageName).should('exist');

    // Should set new language as default
    cy.getByCy(`${mockNewLanguageName}-checkbox`).click();
    cy.getByCy('set-language-as-default-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`${mockNewLanguageName}-checkbox`).should('be.checked');
    cy.getByCy(`${mockDefaultLanguageName}-checkbox`).should('not.be.checked');
    cy.getByCy('success-notification').should('exist');
    cy.getByCy(`${mockDefaultLanguageName}-checkbox`).click();
    cy.getByCy('confirm').click();

    // Should update language
    cy.getByCy(`${mockNewLanguageName}-update`).click();
    cy.getByCy('update-language-modal').should('exist');
    cy.getByCy('language-name').clear().type(mockUpdatedLanguageName);
    cy.getByCy('language-key').select(mockUpdatedLanguageKey);
    cy.getByCy('language-submit').click();
    cy.getByCy('success-notification').should('exist');
    cy.getByCy(mockUpdatedLanguageName).should('exist');

    // Delete default language button should be disabled
    cy.getByCy(`${mockDefaultLanguageName}-delete`).should('be.disabled');

    // Should delete language
    cy.getByCy(`${mockUpdatedLanguageName}-delete`).click();
    cy.getByCy('delete-language-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy('success-notification').should('exist');
    cy.getByCy(mockUpdatedLanguageName).should('not.exist');
  });
});
