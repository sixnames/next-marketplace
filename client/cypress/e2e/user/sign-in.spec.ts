/// <reference types="cypress" />

import { ME_AS_ADMIN } from '../../../config';

const signInPath = '/sign-in';
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
    cy.getByCy(`email-error`).should('have.length', 1);
    cy.getByCy(`password-error`).should('have.length', 1);

    // User should sign in
    cy.visit(signInPath);
    cy.getByCy(`sign-in-email`).clear().type(ME_AS_ADMIN.email);
    cy.getByCy(`sign-in-password`).clear().type(ME_AS_ADMIN.password);
    cy.getByCy(`sign-in-submit`).click();
    cy.location('pathname').should('eq', '/');

    // User should sign out
    cy.getByCy(`user-nav-trigger`).click();
    cy.getByCy(`user-nav-container`).should('exist');
    cy.getByCy(`user-nav-sign-out`).click();
    cy.location('pathname').should('eq', '/');
  });
});
