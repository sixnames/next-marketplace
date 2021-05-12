/// <reference types="cypress" />
/// <reference path="../../types/index.d.ts" />

import { ADULT_KEY, ADULT_TRUE } from 'config/common';

export {};

describe('Authorization', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.visit(`/`);
  });

  /*after(() => {
    cy.clearTestData();
  });*/

  it('Should have a sign in page', () => {
    cy.getByCy(`sign-in-link`).click();

    // User should sign in
    cy.getByCy(`sign-in-email`).clear().type('admin@gmial.com');
    cy.getByCy(`sign-in-password`).clear().type('password');
    cy.getByCy(`sign-in-submit`).click();

    // User should sign out
    cy.getByCy(`burger-trigger`).click();
    cy.getByCy(`burger-dropdown`).should('exist');
    cy.getByCy(`burger-sign-out-link`).click();
    cy.getByCy(`profile-link`).should('not.exist');
  });
});
