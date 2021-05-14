import { ADULT_KEY, ADULT_TRUE, CATALOGUE_DEFAULT_RUBRIC_SLUG } from 'config/common';

describe('Catalogue filter', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.visit(`/`);
  });

  it('Should have catalogue and filters', () => {
    // Should show search result
    cy.getByCy('header-search-trigger').click();
    cy.getByCy('search-dropdown').should('exist');
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-product-name').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });

    cy.getByCy('search-input').type(`vino`);
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-product-name').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    // cy.getByCy('search-close').click();
    cy.get('body').click(0, 0);
    cy.getByCy('search-dropdown').should('not.exist');

    // Should navigate to the rubric
    cy.getByCy(`main-rubric-${CATALOGUE_DEFAULT_RUBRIC_SLUG}`).trigger('mouseover');
    cy.getByCy('header-nav-dropdown').should('be.visible');
    cy.getByCy(`main-rubric-${CATALOGUE_DEFAULT_RUBRIC_SLUG}`).click();
    cy.getByCy('catalogue').should('exist');
    cy.getByCy('catalogue-title').contains('Вино');

    // Should update page title
    cy.getByCy(`catalogue-option-000012`).click();
    cy.getByCy(`catalogue-option-000007`).click();
    cy.getByCy('catalogue-title').then(($el) => {
      console.log($el);
    });
  });
});
