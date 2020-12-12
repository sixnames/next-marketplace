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
    cy.getByTranslationFieldCy({
      cyPrefix: 'main-rubric',
      languages: mockData.rubricLevelOneA.name,
    }).click();
    // Should navigate to cart
    cy.getByCy(`catalogue-item-${mockData.productA.slug}`).click();

    // Add product #1
    cy.getByCy(`card-${mockData.productA.slug}`).should('exist');
    cy.getByCy(`card-tabs-shops`).click();
    cy.getByCy(`card-shops`).should('exist');
    cy.getByCy(`card-shops-list`).should('exist');
    cy.getByCy(`card-shops-${mockData.shopA.slug}-add-to-cart`).click();

    // Add second product #2
    cy.getByCy(`cart-modal-close`).click();
    cy.getByTranslationFieldCy({
      cyPrefix: 'main-rubric',
      languages: mockData.rubricLevelOneA.name,
    }).click();
    cy.getByCy('catalogue').should('exist');
    cy.getByCy(`catalogue-item-${mockData.connectionProductA.slug}`).click();
    cy.getByCy(`card-${mockData.connectionProductA.slug}`).should('exist');
    cy.getByCy(`card-tabs-shops`).click();
    cy.getByCy(`card-shops-${mockData.shopB.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-continue`).click();

    // Should navigate to cart
    cy.getByCy(`cart-aside-confirm`).click();

    // Should navigate to order form
    cy.getByCy(`order-form`).should('exist');

    // Should validate and fill all order fields
    const customerName = 'newUser';
    const customerPhone = '78889990011';
    const customerEmail = 'newUser@mail.com';
    cy.getByCy(`order-form-name`).type(customerName);
    cy.getByCy(`order-form-phone`).type(customerPhone);
    cy.getByCy(`order-form-email`).type(customerEmail);
    cy.getByCy(`order-form-comment`).type('comment');

    // Should make an order and redirect to the Thank you page
    cy.getByCy(`cart-aside-confirm`).click();
    cy.get(`[data-cy="thank-you"]`).then((e) => {
      // Get created order itemId
      const orderItemId = e.attr('data-order-item-id');

      // Should display all orders list
      cy.testAuth(`/app/cms/orders${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
      cy.getByCy(`${orderItemId}-row`).should('contain', customerName);
      cy.getByCy(`${orderItemId}-row`).should('contain', customerEmail);

      // Should navigate to the order details
      cy.getByCy(`order-${orderItemId}-link`).click();
      cy.getByCy(`order-details`).should('exist');
    });
  });
});
