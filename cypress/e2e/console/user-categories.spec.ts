import { ROUTE_CONSOLE } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

describe('User categories', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CONSOLE}/${fixtureIds.companyA}/user-categories`, 'ownerA@gmail.com');
  });

  it('Should CRUD user categories', () => {
    cy.getByCy('user-categories-list').should('exist');
  });
});
