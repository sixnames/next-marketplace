describe('Profile orders', () => {
  beforeEach(() => {
    cy.testAuth(`/`);
  });

  it('Should display visitor orders', () => {
    cy.makeAnOrder({
      callback: () => {
        const orderItemIdA = '1000000';
        const orderItemIdB = '1000001';

        cy.getByCy('header-user-dropdown-trigger').click();
        cy.getByCy('header-user-dropdown-profile-link').click();
        cy.getByCy('profile-orders').should('exist');
        cy.getByCy(`profile-order-${orderItemIdA}`).should('exist');
        cy.getByCy(`profile-order-${orderItemIdA}-open`).click();
        cy.getByCy(`profile-order-${orderItemIdA}-content`).should('exist');

        // Should add all products to cart from old order
        cy.getByCy(`profile-order-${orderItemIdA}-repeat`).click();
        cy.getByCy(`cart-modal-close`).click();

        // Should add products to cart from old order
        cy.get(`[data-cy=profile-order-1-product-0-add-to-cart]`).then(($el) => {
          if (!$el.prop('disabled')) {
            cy.wrap($el).click();
            cy.getByCy(`cart-modal`).should('exist');
            cy.getByCy(`cart-modal-close`).click();
          }
        });

        cy.getByCy(`profile-order-${orderItemIdB}-open`).click();
        cy.get(`[data-cy=profile-order-2-product-0-add-to-cart]`).then(($el) => {
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
