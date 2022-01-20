import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { ROUTE_CATALOGUE, ROUTE_CMS } from '../../../config/common';

describe('Promo code', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CATALOGUE}/${fixtureIds.rubricWhiskeySlug}`);
  });

  it.only('Should create order with promo code', () => {
    // add promo product to the cart
    cy.getByCy(`catalogue-item-0-add-to-cart-grid`).click();
    cy.getByCy(`cart-modal-close`).click();

    // add non promo product to the cart
    cy.getByCy(`catalogue-item-1-add-to-cart-grid`).click();
    cy.getByCy(`cart-modal-continue`).click();
    cy.wait(1500);

    // add promo code
    cy.getByCy(`cart`).should('exist');
    cy.getByCy(`promo-code-input-${fixtureIds.shopASlug}`).type('code');
    cy.getByCy(`promo-code-submit-${fixtureIds.shopASlug}`).click();
    cy.wait(1500);

    // make an order
    cy.getByCy(`cart-aside-confirm`).click();
    cy.wait(1500);
    cy.getByCy(`thank-you`).should('exist');

    // check cms order
    cy.visit(`${ROUTE_CMS}/orders`);
    cy.getByCy('order-1000000-link').click();
  });
});
