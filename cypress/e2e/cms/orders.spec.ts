import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Admin orders', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.visit(`/`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should make an order and show it in cms', () => {
    const orderFields = {
      customerName: 'newUser777',
      customerPhone: '+71233211234',
      customerEmail: 'newUser777@mail.com',
    };

    cy.makeAnOrder({
      mockData,
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
