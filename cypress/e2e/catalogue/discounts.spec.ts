import { ROUTE_CATALOGUE } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

describe('Order discounts', () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it('Should make an order with discounts', () => {
    cy.visit(`${ROUTE_CATALOGUE}/${fixtureIds.rubricWineSlug}`);

    // add product #1
    cy.visitLinkHref('catalogue-item-0-name-grid');
    cy.getByCy(`card`).should('exist');
    cy.getByCy(`card-shops-${fixtureIds.shopASlug}-add-to-cart`).click();

    // add product #2
    cy.getByCy(`cart-modal-close`).click();
    cy.getByCy(`card-shops-${fixtureIds.shopBSlug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-continue`).click();

    // should navigate to cart
    cy.wait(1500);
    cy.getByCy(`cart`).should('exist');

    cy.getByCy(`order-form-name`).clear().type('name');
    cy.getByCy(`order-form-phone`).clear().type('71233211234');
    cy.getByCy(`order-form-email`).clear().type('email@mail.com');
  });
});
