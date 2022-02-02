import { ISO_LANGUAGES } from '../../../config/constantSelects';
import { getProjectLinks } from '../../../lib/getProjectLinks';

describe('Languages', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.languages.url);
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
    cy.wait(1000);
    cy.getByCy(`${mockNewLanguage.name}-row`).should('exist');

    // Should update language
    cy.getByCy(`${mockNewLanguage.name}-update`).click();
    cy.getByCy('update-language-modal').should('exist');
    cy.getByCy('language-name').clear().type(mockUpdatedLanguage.name);
    cy.getByCy('language-nativeName').clear().type(mockUpdatedLanguage.nativeName);
    cy.getByCy('language-slug').select(mockUpdatedLanguage.slug);
    cy.getByCy('language-submit').click();
    cy.getByCy('update-language-modal').should('not.exist');
    cy.wait(1000);
    cy.getByCy(`${mockUpdatedLanguage.name}-row`).should('exist');

    // Delete default language button should be disabled
    cy.getByCy(`${mockDefaultLanguageName}-delete`).should('be.disabled');

    // Should delete language
    cy.getByCy(`${mockUpdatedLanguage.name}-delete`).click();
    cy.getByCy('delete-language-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.getByCy('delete-language-modal').should('not.exist');
    cy.wait(1000);
    cy.getByCy(`${mockUpdatedLanguage.name}-row`).should('not.exist');
  });
});
