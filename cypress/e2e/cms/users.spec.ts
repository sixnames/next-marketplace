import { ADULT_KEY, ADULT_TRUE, ROUTE_CMS } from 'config/common';

describe('Users', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`${ROUTE_CMS}/users`);
  });

  it('Should CRUD users', () => {
    // const newUserName = 'newUserName';
    // const updatedUserName = 'updatedUserName';

    // Should create nav item
    cy.getByCy('users-list').should('exist');
  });
});
