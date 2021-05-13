import { ADULT_KEY, ADULT_TRUE } from 'config/common';

describe('Profile orders', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`/`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should display visitor orders', () => {
    cy.makeAnOrder({
      callback: ({ orderItemId }) => {
        cy.getByCy('profile-link').click();
        cy.getByCy('profile-nav').should('exist');
        cy.getByCy('profile-orders').should('exist');
        cy.getByCy(`profile-order-${orderItemId}`).should('exist');
        cy.getByCy(`profile-order-${orderItemId}-open`).click();
        cy.getByCy(`profile-order-${orderItemId}-content`).should('exist');

        // Should add all products to cart from old order
        cy.getByCy(`profile-order-${orderItemId}-repeat`).click();
        cy.getByCy(`cart-modal-close`).click();

        // Should add product to cart from old order
        cy.getByCy(`profile-order-product--add-to-cart`).click();
        cy.getByCy(`cart-modal`).should('exist');
        cy.getByCy(`cart-modal-close`).click();
      },
    });
  });
});
