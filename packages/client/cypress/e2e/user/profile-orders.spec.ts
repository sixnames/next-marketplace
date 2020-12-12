/// <reference types="cypress" />

describe('Profile orders', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should display visitor orders', () => {
    cy.makeAnOrder({
      mockData,
      callback: (orderItemId) => {
        cy.getByCy('profile-link').click();
        cy.getByCy('profile-nav').should('exist');
        cy.getByCy('profile-orders').should('exist');
      },
    });
  });
});
