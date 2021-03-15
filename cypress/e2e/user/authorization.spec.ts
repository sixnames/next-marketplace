/// <reference types="cypress" />
/// <reference path="../../types/index.d.ts" />
import { DEFAULT_CITY } from 'config/common';

export {};

describe('Authorization', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.visit(`/${DEFAULT_CITY}/`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have a sign in page', () => {
    cy.getByCy(`sign-in-link`).click();

    // User should sign in
    cy.getByCy(`sign-in-email`).clear().type(Cypress.env('adminEmail'));
    cy.getByCy(`sign-in-password`).clear().type(Cypress.env('adminPassword'));
    cy.getByCy(`sign-in-submit`).click();
    cy.location('pathname').should('eq', `/${DEFAULT_CITY}`);

    // User should sign out
    cy.getByCy(`burger-trigger`).click();
    cy.getByCy(`burger-dropdown`).should('exist');
    cy.getByCy(`burger-sign-out-link`).click();
    cy.location('pathname').should('eq', `/${DEFAULT_CITY}`);
    cy.getByCy(`profile-link`).should('not.exist');
  });
});
