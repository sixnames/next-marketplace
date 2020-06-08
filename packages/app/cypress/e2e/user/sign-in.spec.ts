import { ME_AS_ADMIN } from '@rg/config';

const signInPath = '/sign-in';

describe('Authorization', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should have a sign in page', () => {
    cy.getByCy(`sign-in-link`).click();
    cy.location('pathname').should('include', '/sign-in');
  });

  it('Should show sign in validation errors', () => {
    const fakeEmail = 'fake@gm';
    const fakePassword = 'fake';

    cy.visit(signInPath);
    cy.getByCy(`sign-in-email`).type(fakeEmail).blur();
    cy.getByCy(`sign-in-password`).type(fakePassword).blur();
    cy.getByCy(`sign-in-submit`).click();
    cy.getByCy(`email-error`).should('have.length', 1);
    cy.getByCy(`password-error`).should('have.length', 1);
  });

  it('User should sign in', () => {
    cy.visit(signInPath);
    cy.getByCy(`sign-in-email`).type(ME_AS_ADMIN.email);
    cy.getByCy(`sign-in-password`).type(ME_AS_ADMIN.password);
    cy.getByCy(`sign-in-submit`).click();
    cy.location('pathname').should('eq', '/');
  });

  it('User should sign out', () => {
    cy.visit(signInPath);
    cy.getByCy(`sign-in-email`).type(ME_AS_ADMIN.email);
    cy.getByCy(`sign-in-password`).type(ME_AS_ADMIN.password);
    cy.getByCy(`sign-in-submit`).click();
    cy.getByCy(`close-notification`).click();
    cy.location('pathname').should('eq', '/');

    cy.getByCy(`user-nav-trigger`).click();
    cy.getByCy(`user-nav-container`).should('exist');
    cy.getByCy(`user-nav-sign-out`).click();
    cy.location('pathname').should('eq', '/');
  });
});
