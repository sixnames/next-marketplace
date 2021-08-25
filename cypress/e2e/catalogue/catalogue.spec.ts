import { CATALOGUE_DEFAULT_RUBRIC_SLUG } from 'config/common';

describe('Catalogue filter', () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it('Should have catalogue and filters', () => {
    // Should show search result
    cy.getByCy('header-search-trigger').click();
    cy.getByCy('search-dropdown').should('exist');
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-product-name-grid').should(($rubric) => {
      expect($rubric).to.have.length(4);
    });

    cy.getByCy('search-input').type(`vino`);
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-product-name-grid').should(($rubric) => {
      expect($rubric).to.have.length(4);
    });
    cy.get('body').click(0, 0);
    cy.getByCy('search-dropdown').should('not.exist');

    // Should navigate to the rubric
    cy.getByCy(`main-rubric-${CATALOGUE_DEFAULT_RUBRIC_SLUG}`).click();
    cy.getByCy('catalogue').should('exist');
    cy.getByCy('catalogue-title').contains('Вино');

    // Should update page title
    cy.getByCy('sticky-nav').then((el: any) => {
      el.css('position', 'relative');
      cy.getByCy(`catalogue-option-1-0`).click();
    });
    cy.getByCy('sticky-nav').then((el: any) => {
      el.css('position', 'relative');
      cy.getByCy(`catalogue-option-2-0`).click();
    });
  });
});
