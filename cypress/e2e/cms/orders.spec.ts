import { ROUTE_CMS } from 'config/common';

describe('Admin orders', () => {
  beforeEach(() => {
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
      callback: () => {
        const orderItemIdA = '1000000';
        const orderItemIdB = '1000001';

        // Should display all orders list
        cy.testAuth(`${ROUTE_CMS}/orders`);
        cy.wait(1500);
        cy.getByCy(`${orderItemIdA}-row`).should('contain', orderFields.customerName);
        cy.getByCy(`${orderItemIdB}-row`).should('contain', orderFields.customerEmail);

        // Should navigate to the order details
        cy.getByCy(`order-${orderItemIdA}-link`).click();
        cy.wait(1500);
        cy.getByCy(`order-details`).should('exist');
      },
    });
  });
});
