/// <reference types="cypress" />
import { ME_AS_ADMIN } from '../../../../api/src/config';

describe('Mocks', () => {
  it('Smoke test', () => {
    cy.auth({ email: ME_AS_ADMIN.email, password: ME_AS_ADMIN.password, redirect: '/' });
    cy.location('pathname').should('eq', '/');
    cy.getByCy(`user-nav-trigger`).should('exist');
  });
});
