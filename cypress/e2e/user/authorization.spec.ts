/// <reference types="cypress" />
/// <reference path="../../types/index.d.ts" />

export {};

describe('Authorization', () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it('Should have a sign in page', () => {
    cy.getByCy(`header-sign-in-link`).click();

    // User should sign in
    cy.getByCy(`sign-in-email`).clear().type('admin@gmail.com');
    cy.getByCy(`sign-in-password`).clear().type('password');
    cy.getByCy(`sign-in-submit`).click();

    // User should sign out
    cy.getByCy(`header-user-dropdown-trigger`).click();
    cy.getByCy(`header-sign-out-link`).click();
    cy.getByCy(`header-sign-in-link`).should('exist');
  });
});
