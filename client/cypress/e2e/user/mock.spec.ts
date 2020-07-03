/// <reference types="cypress" />
describe('Mocks', () => {
  it('Smoke test', () => {
    cy.auth({ redirect: '/' });
    cy.location('pathname').should('eq', '/');
    cy.getByCy(`user-nav-trigger`).should('exist');
  });
});
