/// <reference types="cypress" />
import { ME_AS_ADMIN } from '@yagu/mocks';
const fakeEmail = 'fake@gm';
const fakePassword = 'fake';

describe('Authorization', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should have a sign in page', () => {
    cy.getByCy(`sign-in-link`).click();

    // Should show sign in validation errors
    cy.getByCy(`sign-in-email`).type(fakeEmail).blur();
    cy.getByCy(`sign-in-password`).type(fakePassword).blur();
    cy.getByCy(`sign-in-submit`).click();
    cy.getByCy(`email-error`).should('exist');
    cy.getByCy(`password-error`).should('exist');

    // User should sign in
    cy.getByCy(`sign-in-email`).clear().type(ME_AS_ADMIN.email);
    cy.getByCy(`sign-in-password`).clear().type(ME_AS_ADMIN.password);
    cy.getByCy(`sign-in-submit`).click();
    cy.location('pathname').should('eq', '/');

    // User should sign out
    cy.getByCy(`burger-trigger`).click();
    cy.getByCy(`burger-dropdown`).should('exist');
    cy.getByCy(`burger-sign-out-link`).click();
    cy.location('pathname').should('eq', '/');
    cy.getByCy(`profile-link`).should('not.exist');
  });
});
