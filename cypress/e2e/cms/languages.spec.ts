import { ISO_LANGUAGES, ROUTE_CMS } from 'config/common';

describe('Languages', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`${ROUTE_CMS}/languages`);
  });

  after(() => {
    cy.clearTestData();
  });

  it(`Should CRUD languages`, () => {
    const mockNewLanguage = ISO_LANGUAGES[2];
    const mockUpdatedLanguage = ISO_LANGUAGES[3];
    const mockDefaultLanguageName = 'Русский';

    // Shouldn't create new language on validation error
    cy.getByCy('language-create').click();
    cy.getByCy('create-language-modal').should('exist');
    cy.getByCy('language-submit').click();
    cy.getByCy('name-error').should('exist');
    cy.getByCy('slug-error').should('exist');

    // Should create new language
    cy.getByCy('language-name').clear().type(mockNewLanguage.name);
    cy.getByCy('language-nativeName').clear().type(mockNewLanguage.nativeName);
    cy.getByCy('language-slug').select(mockNewLanguage.slug);
    cy.getByCy('language-submit').click();
    cy.getByCy('create-language-modal').should('not.exist');
    cy.shouldSuccess();
    cy.getByCy(`${mockNewLanguage.name}-row`).should('exist');

    // Should update language
    cy.getByCy(`${mockNewLanguage.name}-update`).click();
    cy.getByCy('update-language-modal').should('exist');
    cy.getByCy('language-name').clear().type(mockUpdatedLanguage.name);
    cy.getByCy('language-nativeName').clear().type(mockUpdatedLanguage.nativeName);
    cy.getByCy('language-slug').select(mockUpdatedLanguage.slug);
    cy.getByCy('language-submit').click();
    cy.getByCy('update-language-modal').should('not.exist');
    cy.shouldSuccess();
    cy.getByCy(`${mockUpdatedLanguage.name}-row`).should('exist');

    // Delete default language button should be disabled
    cy.getByCy(`${mockDefaultLanguageName}-delete`).should('be.disabled');

    // Should delete language
    cy.getByCy(`${mockUpdatedLanguage.name}-delete`).click();
    cy.getByCy('delete-language-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy('delete-language-modal').should('not.exist');
    cy.shouldSuccess();
    cy.getByCy(`${mockUpdatedLanguage.name}-row`).should('not.exist');
  });
});
