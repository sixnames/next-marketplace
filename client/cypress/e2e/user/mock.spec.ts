/// <reference types="cypress" />

describe('Mocks', () => {
  beforeEach(() => {
    cy.createTestData();
  });

  after(() => {
    cy.clearTestData();
  });

  it('Smoke test', () => {
    cy.testAuth();
    cy.location('pathname').should('eq', '/');
    cy.getByCy(`user-nav-trigger`).should('exist');
  });
});
