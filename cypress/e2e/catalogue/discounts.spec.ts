import { ROUTE_CATALOGUE, ROUTE_CMS } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

describe('Order discounts', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CATALOGUE}/${fixtureIds.rubricWineSlug}`);
  });

  it('Should make an order with gift certificates', () => {
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

    // should enter gift certificates
    // shop a
    cy.getByCy(`gift-certificate-input-${fixtureIds.shopASlug}`).type(
      fixtureIds.companyAGiftCertificate,
    );
    cy.getByCy(`gift-certificate-confirm-${fixtureIds.shopASlug}`).click();
    cy.getByCy('gift-certificate-check-message').should('exist');
    cy.getByCy(`close-modal`).click();

    // shop b
    cy.getByCy(`gift-certificate-input-${fixtureIds.shopBSlug}`).type(
      fixtureIds.companyBGiftCertificate,
    );
    cy.getByCy(`gift-certificate-confirm-${fixtureIds.shopBSlug}`).click();
    cy.getByCy('gift-certificate-check-message').should('exist');
    cy.getByCy(`close-modal`).click();

    // add customer comment
    cy.getByCy(`order-form-comment`).type('comment');
    cy.getByCy(`order-form-privacy-checkbox`).check();

    // should make an order and redirect to the thank-you page
    cy.getByCy(`cart-aside-confirm`).click();
  });

  it('Should make an order with promo code', () => {
    cy.visit(`${ROUTE_CATALOGUE}/${fixtureIds.rubricWhiskeySlug}`);

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
    cy.getByCy(`order-form-privacy-checkbox`).check();
    cy.getByCy(`cart-aside-confirm`).click();
    cy.wait(1500);
    cy.getByCy(`thank-you`).should('exist');

    // check cms order
    cy.visit(`${ROUTE_CMS}/orders`);
    cy.getByCy('order-1000000-link').click();
    cy.getByCy(`order-promo-list`).should('exist');
    cy.getByCy(`order-discounted-price`).should('exist');
  });
});
