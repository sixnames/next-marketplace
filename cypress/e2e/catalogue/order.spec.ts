import { ADULT_KEY, ADULT_TRUE } from 'config/common';

describe('Make an order', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.visit(`/`);
  });

  it('Should make an order', () => {
    cy.makeAnOrder({
      orderFields: {
        customerEmail: 'email@mail.com',
        customerPhone: '71233211234',
        customerName: 'name',
      },
    });
  });
});
