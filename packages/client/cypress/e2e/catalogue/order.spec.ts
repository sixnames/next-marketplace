/// <reference types="cypress" />

describe('Cart', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.visit('/');
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD cart items', () => {
    cy.getByTranslationFieldCy({
      cyPrefix: 'main-rubric',
      languages: mockData.rubricLevelOneA.name,
    }).click();
    // Should navigate to cart
    cy.getByCy(`catalogue-item-${mockData.productA.slug}`).click();

    // Add product
    cy.getByCy(`card-${mockData.productA.slug}`).should('exist');
    cy.getByCy(`card-tabs-shops`).click();
    cy.getByCy(`card-shops`).should('exist');
    cy.getByCy(`card-shops-list`).should('exist');
    cy.getByCy(`card-shops-${mockData.shopA.slug}-plus`).click();
    cy.getByCy(`card-shops-${mockData.shopA.slug}-input`).should('have.value', '2');
    cy.getByCy(`card-shops-${mockData.shopA.slug}-add-to-cart`).click();

    // Add same product
    cy.getByCy(`cart-modal-close`).click();
    cy.getByCy(`card-shops-${mockData.shopA.slug}-add-to-cart`).click();

    // Add second product
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

    // Add shopless product from catalogue
    cy.getByCy(`cart-modal-close`).click();
    cy.getByTranslationFieldCy({
      cyPrefix: 'main-rubric',
      languages: mockData.rubricLevelOneA.name,
    }).click();
    cy.getByCy(`catalogue-item-${mockData.connectionProductA.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-continue`).click();

    // Confirm button should be disabled if there is shopless products in cart
    cy.getByCy(`cart-aside-confirm`).should('be.disabled');
    cy.getByCy(`cart-aside-warning`).should('exist');

    // Should add shop to the shopless cart product
    cy.getByCy(`${mockData.connectionProductA.slug}-show-shops`).click();
    cy.getByCy(`cart-shops-list`).should('exist');
    cy.getByCy(`cart-shops-${mockData.shopA.slug}-add-to-cart`).click();
    cy.getByCy(`cart-shops-list`).should('not.exist');
    cy.getByCy(`${mockData.connectionProductA.slug}-show-shops`).should('not.exist');

    // Should navigate to cart
    cy.getByCy(`cart`).should('exist');
    cy.getByCy(`cart-aside`).should('exist');
    cy.getByCy(`cart-aside-total`).should('exist');
    cy.getByCy(`cart-aside-confirm`).click();

    // Should navigate to order form
    cy.getByCy(`order-form`).should('exist');
    cy.getByCy(`cart-aside-back-link`).click();
    cy.getByCy(`cart-aside-confirm`).should('exist');
    cy.getByCy(`cart-aside-confirm`).click();

    // Should validate and fill all order fields
    cy.getByCy(`cart-aside-confirm`).click();
    cy.get('[data-error="name"]').should('exist');
    cy.get('[data-error="phone"]').should('exist');
    cy.get('[data-error="email"]').should('exist');

    cy.getByCy(`order-form-name`).type('name');
    cy.getByCy(`order-form-phone`).type('78889990011');
    cy.getByCy(`order-form-email`).type('email@mail.com');
    cy.getByCy(`order-form-comment`).type('comment');
  });
});
