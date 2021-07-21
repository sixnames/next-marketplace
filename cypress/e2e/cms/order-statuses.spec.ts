import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('Order statuses', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/order-statuses`);
  });

  it(`Should CRUD order statuses`, () => {
    const newOrderStatusName = 'newOrderStatusName';
    const newOrderStatusIndex = '10';
    const newOrderStatusColor = '#26ff00';
    const updatedOrderStatusName = 'updatedOrderStatusName';
    const updatedOrderStatusIndex = '11';
    const updatedOrderStatusColor = '#ff0000';

    // should create order status
    cy.getByCy('order-statuses-list').should('exist');
    cy.getByCy('create-order-status').click();
    cy.getByCy('order-status-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newOrderStatusName);
    cy.getByCy(`index`).clear().type(newOrderStatusIndex);
    cy.getByCy(`color`).then((el: any) => {
      el.attr('type', 'text');
      cy.wrap(el).clear().type(newOrderStatusColor);
      cy.getByCy('submit-order-status').click();
    });
    cy.wait(1500);
    cy.getByCy(`${newOrderStatusName}-row`).should('exist');

    // should update order status
    cy.getByCy(`${newOrderStatusName}-update`).click();
    cy.getByCy('order-status-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedOrderStatusName);
    cy.getByCy(`index`).clear().type(updatedOrderStatusIndex);
    cy.getByCy(`color`).then((el: any) => {
      el.attr('type', 'text');
      cy.wrap(el).clear().type(updatedOrderStatusColor);
      cy.getByCy('submit-order-status').click();
    });

    // should delete order status
    cy.wait(1500);
    cy.getByCy(`${updatedOrderStatusName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedOrderStatusName}-row`).should('not.exist');
  });
});
