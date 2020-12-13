/// <reference types="cypress" />

import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';

describe('Admin orders', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearTestData();
  });

  it('Should make an order and show it in cms', () => {
    const orderFields = {
      customerName: 'newUser',
      customerPhone: '78889990011',
      customerEmail: 'newUser@mail.com',
    };

    cy.makeAnOrder({
      mockData,
      orderFields,
      callback: ({ orderItemId }) => {
        // Should display all orders list
        cy.testAuth(`/app/cms/orders${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
        cy.getByCy(`${orderItemId}-row`).should('contain', orderFields.customerName);
        cy.getByCy(`${orderItemId}-row`).should('contain', orderFields.customerEmail);

        // Should navigate to the order details
        cy.getByCy(`order-${orderItemId}-link`).click();
        cy.getByCy(`order-details`).should('exist');
      },
    });
  });
});
