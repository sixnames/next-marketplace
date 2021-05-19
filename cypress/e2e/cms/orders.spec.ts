import { ADULT_KEY, ADULT_TRUE } from 'config/common';

describe('Admin orders', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.visit(`/`);
  });

  it('Should make an order and show it in cms', () => {
    const orderFields = {
      customerName: 'newUser777',
      customerPhone: '+71233211234',
      customerEmail: 'newUser777@mail.com',
    };

    cy.makeAnOrder({
      // mockData,
      orderFields,
      callback: ({ orderItemId }) => {
        // Should display all orders list
        cy.testAuth(`/cms/orders`);
        cy.getByCy(`${orderItemId}-row`).should('contain', orderFields.customerName);
        cy.getByCy(`${orderItemId}-row`).should('contain', orderFields.customerEmail);

        // Should navigate to the order details
        cy.getByCy(`order-${orderItemId}-link`).click();
        cy.getByCy(`order-details`).should('exist');
      },
    });
  });
});
