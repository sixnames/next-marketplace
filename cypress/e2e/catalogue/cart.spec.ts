import {
  ADULT_KEY,
  ADULT_TRUE,
  CATALOGUE_DEFAULT_RUBRIC_SLUG,
  ROUTE_CATALOGUE,
} from 'config/common';

describe('Cart', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.visit(`${ROUTE_CATALOGUE}/${CATALOGUE_DEFAULT_RUBRIC_SLUG}`);
  });

  it('Should CRUD cart items', () => {
    cy.getByCy('catalogue').should('exist');
    cy.get(`[data-cy=catalogue-item-0-name]`).invoke('removeAttr', 'target').click();

    // Add product #1
    cy.getByCy(`card`).should('exist');
    cy.getByCy(`card-shops-1-0-add-to-cart`).click();

    // Add same product
    cy.getByCy(`cart-modal-close`).click();
    cy.getByCy(`card-shops-1-0-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '1');

    // Add second product
    cy.getByCy(`cart-modal-close`).click();
    cy.visit(`${ROUTE_CATALOGUE}/${CATALOGUE_DEFAULT_RUBRIC_SLUG}`);
    cy.getByCy('catalogue').should('exist');
    cy.get(`[data-cy=catalogue-item-1-name]`).invoke('removeAttr', 'target').click();
    cy.getByCy(`card`).should('exist');
    cy.getByCy(`card-connection`).first().click();
    cy.wait(1500);
    cy.getByCy(`card-shops-1-0-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '2');

    // Add shopless product from catalogue
    cy.getByCy(`cart-modal-close`).click();
    cy.getByCy(`cart-counter`).should('contain', '2');
    cy.visit(`${ROUTE_CATALOGUE}/${CATALOGUE_DEFAULT_RUBRIC_SLUG}`);
    cy.getByCy(`catalogue-item-2-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '3');

    // Add shopless product from card
    cy.getByCy(`cart-modal-close`).click();
    cy.get(`[data-cy=catalogue-item-3-name]`).invoke('removeAttr', 'target').click();
    cy.getByCy(`card-plus`).click();
    cy.getByCy(`card-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '4');

    // Should navigate to cart
    cy.getByCy(`cart-modal-continue`).click();
    cy.getByCy(`cart`).should('exist');
    cy.getByCy(`cart-counter`).should('contain', '4');
    cy.getByCy(`cart-products`).should('exist');
    cy.getByCy(`cart-product`).should('have.length', 4);

    // Should delete product form cart
    cy.getByCy(`cart-product-2-remove-from-cart`).click();
    cy.getByCy(`cart-product`).should('have.length', 3);

    // Should add shop to the shopless cart product
    cy.getByCy(`cart-product-2-show-shops`).click();
    cy.getByCy(`cart-shops-list`).should('exist');
    cy.getByCy(`cart-shops-0-add-to-cart`).click();
    cy.getByCy(`cart-shops-list`).should('not.exist');
    cy.getByCy(`cart-product-2-show-shops`).should('not.exist');

    // Should update product amount
    cy.getByCy(`cart-product-0-plus`).click();
    cy.getByCy(`cart-product-0-amount`).should('have.value', '3');

    // Should have cart dropdown
    cy.visit(`${ROUTE_CATALOGUE}/${CATALOGUE_DEFAULT_RUBRIC_SLUG}`);
    cy.getByCy('catalogue').should('exist');
    cy.getByCy(`header-cart-dropdown-trigger`).click();
    cy.getByCy(`cart-dropdown`).should('exist');

    // Should update product amount in dropdown
    // TODO remove .first() after reach-ui replacement
    cy.getByCy(`cart-dropdown-product-0-minus`).first().click();
    cy.getByCy(`cart-dropdown-product-0-amount`).first().should('have.value', '2');

    // Should delete cart product form dropdown
    cy.getByCy(`cart-dropdown-product-0-remove-from-cart`).first().click();

    // Should remove all cart products
    cy.getByCy('clear-cart').first().click();
    cy.getByCy(`cart-dropdown`).should('not.exist');
    cy.getByCy(`cart-counter`).should('not.exist');
    cy.shouldSuccess();
  });
});
