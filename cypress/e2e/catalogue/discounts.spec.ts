import { ROUTE_CATALOGUE } from 'config/common';
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
    cy.getByCy(`order-form-privacy`).check();

    // should make an order and redirect to the thank-you page
    cy.getByCy(`cart-aside-confirm`).click();
  });
});
