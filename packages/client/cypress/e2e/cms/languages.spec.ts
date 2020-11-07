/// <reference types="cypress" />
import { ISO_LANGUAGES } from '@yagu/mocks';

describe('Languages', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/languages`);
  });

  after(() => {
    cy.clearTestData();
  });

  it(`Should CRUD languages`, () => {
    const mockNewLanguageName = ISO_LANGUAGES[2].nameString;
    const mockNewLanguageKey = ISO_LANGUAGES[2].id;
    const mockUpdatedLanguageName = ISO_LANGUAGES[3].nameString;
    const mockUpdatedLanguageKey = ISO_LANGUAGES[3].id;
    const mockDefaultLanguageName = 'Русский';

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
    cy.shouldSuccess();
    cy.getByCy(mockNewLanguageName).should('exist');

    // Should set new language as default
    cy.getByCy(`${mockNewLanguageName}-checkbox`).click();
    cy.getByCy('set-language-as-default-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy(`${mockNewLanguageName}-checkbox`).should('be.checked');
    cy.getByCy(`${mockDefaultLanguageName}-checkbox`).should('not.be.checked');
    cy.shouldSuccess();
    cy.getByCy(`${mockDefaultLanguageName}-checkbox`).click();
    cy.getByCy('confirm').click();

    // Should update language
    cy.getByCy(`${mockNewLanguageName}-update`).click();
    cy.getByCy('update-language-modal').should('exist');
    cy.getByCy('language-name').clear().type(mockUpdatedLanguageName);
    cy.getByCy('language-key').select(mockUpdatedLanguageKey);
    cy.getByCy('language-submit').click();
    cy.shouldSuccess();
    cy.getByCy(mockUpdatedLanguageName).should('exist');

    // Delete default language button should be disabled
    cy.getByCy(`${mockDefaultLanguageName}-delete`).should('be.disabled');

    // Should delete language
    cy.getByCy(`${mockUpdatedLanguageName}-delete`).click();
    cy.getByCy('delete-language-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.shouldSuccess();
    cy.getByCy(mockUpdatedLanguageName).should('not.exist');
  });
});
