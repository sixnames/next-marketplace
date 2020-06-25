/// <reference types="cypress" />
import schema from '../../../src/generated/introspectionSchema.json';
import { ME_AS_ADMIN } from '../../../src/config';

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
    cy.visit('/app/');
  });

  it('Smoke test', () => {
    cy.getByCy(`app-nav-user`).should('exist');
  });
});
