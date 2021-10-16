import { ROUTE_CONSOLE } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

describe('Promo', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CONSOLE}/${fixtureIds.companyA}/promo`, 'ownerA@gmail.com');
  });

  it('Should CRUD prop', () => {
    cy.getByCy('promo-list').should('exist');
  });
});
