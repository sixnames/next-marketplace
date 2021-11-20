import { fixtureIds } from 'cypress/fixtures/fixtureIds';

describe('Catalogue filter', () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it('Should have catalogue and filters', () => {
    // Should show search result
    cy.getByCy('header-search-trigger').click();
    cy.getByCy('search-dropdown').should('exist');
    cy.getByCy('search-product-name-grid').should(($rubric) => {
      expect($rubric).to.have.length(5);
    });

    cy.getByCy('search-input').type(`vino`);
    cy.getByCy('search-product-name-grid').should(($rubric) => {
      expect($rubric).to.have.length(5);
    });
    cy.get('body').click(0, 0);
    cy.getByCy('search-dropdown').should('not.exist');

    // Should navigate to the rubric
    cy.getByCy(`main-rubric-${fixtureIds.rubricWineSlug}`).click();
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
