import { ADULT_KEY, ADULT_TRUE } from 'config/common';

describe('Profile orders', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`/`);
  });

  it('Should display visitor orders', () => {
    cy.makeAnOrder({
      callback: ({ orderItemId }) => {
        cy.getByCy('header-user-dropdown-trigger').click();
        cy.getByCy('header-user-dropdown-profile-link').click();
        cy.getByCy('profile-orders').should('exist');
        cy.getByCy(`profile-order-${orderItemId}`).should('exist');
        cy.getByCy(`profile-order-${orderItemId}-open`).click();
        cy.getByCy(`profile-order-${orderItemId}-content`).should('exist');

        // Should add all products to cart from old order
        cy.getByCy(`profile-order-${orderItemId}-repeat`).click();
        cy.getByCy(`cart-modal-close`).click();

        // Should add products to cart from old order
        cy.get(`[data-cy=profile-order-product-0-add-to-cart]`).then(($el) => {
          if (!$el.prop('disabled')) {
            cy.wrap($el).click();
            cy.getByCy(`cart-modal`).should('exist');
            cy.getByCy(`cart-modal-close`).click();
          }
        });
        cy.get(`[data-cy=profile-order-product-1-add-to-cart]`).then(($el) => {
          if (!$el.prop('disabled')) {
            cy.wrap($el).click();
            cy.getByCy(`cart-modal`).should('exist');
            cy.getByCy(`cart-modal-close`).click();
          }
        });
      },
    });
  });
});
