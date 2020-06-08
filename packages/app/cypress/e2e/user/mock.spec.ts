import schema from '../../../src/generated/introspectionSchema.json';
import { ME_AS_ADMIN } from '@rg/config';

describe('Mocks', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
      },
    });
    cy.visit('/');
  });

  it('Me query', () => {
    cy.getByCy(`user-nav-trigger`).click();
    cy.getByCy(`user-nav-container`).should('have.length', 1);
    cy.getByCy(`user-nav-sign-out`).should('have.length', 1);
  });
});
