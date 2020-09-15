/// <reference types="cypress" />

describe('Catalogue search', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.visit('/');
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should show search result', () => {
    cy.getByCy('search-trigger').click();
    cy.getByCy('search-dropdown').should('exist');
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-product').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });

    cy.getByCy('search-input').type('вино');
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(1);
    });
    cy.getByCy('search-product').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-close').click();
    cy.getByCy('search-dropdown').should('not.exist');
  });
});
