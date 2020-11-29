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
    cy.getByCy('catalogue').should('exist');
    cy.getByCy(`catalogue-item-${mockData.productA.slug}`).click();

    // Add product
    cy.getByCy(`card-${mockData.productA.slug}`).should('exist');
    cy.getByCy(`card-tabs-1`).click();
    cy.getByCy(`card-shops`).should('exist');
    cy.getByCy(`card-shops-list`).should('exist');
    cy.getByCy(`card-shops-${mockData.shopA.slug}-plus`).click();
    cy.getByCy(`card-shops-${mockData.shopA.slug}-input`).should('have.value', '2');
    cy.getByCy(`card-shops-${mockData.shopA.slug}-add-to-cart`).click();

    // Add same product
    cy.getByCy(`cart-modal-close`).click();
    cy.getByCy(`card-shops-${mockData.shopA.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '1');

    // Add second product
    cy.getByCy(`cart-modal-close`).click();
    cy.getByTranslationFieldCy({
      cyPrefix: 'main-rubric',
      languages: mockData.rubricLevelOneA.name,
    }).click();
    cy.getByCy(`catalogue-item-${mockData.connectionProductA.slug}`).click();
    cy.getByCy(`card-${mockData.connectionProductA.slug}`).should('exist');
    cy.getByCy(`connection-${mockData.connectionProductB.slug}`).click();
    cy.getByCy(`card-tabs-1`).click();
    cy.getByCy(`card-shops-${mockData.shopB.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '2');
    cy.getByCy(`cart-counter`).should('contain', '2');

    // Add shopless product from catalogue
    cy.getByCy(`cart-modal-close`).click();
    cy.getByTranslationFieldCy({
      cyPrefix: 'main-rubric',
      languages: mockData.rubricLevelOneA.name,
    }).click();
    cy.getByCy(`catalogue-item-${mockData.connectionProductA.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '3');

    // Add shopless product from card
    cy.getByCy(`cart-modal-close`).click();
    cy.getByCy(`catalogue-item-${mockData.connectionProductC.slug}`).click();
    cy.getByCy(`card-${mockData.connectionProductC.slug}-plus`).click();
    cy.getByCy(`card-${mockData.connectionProductC.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '4');

    // Should navigate to cart
    cy.getByCy(`cart-modal-continue`).click();
    cy.getByCy(`cart`).should('exist');
    cy.getByCy(`cart-counter`).should('contain', '4');
    cy.getByCy(`cart-products`).should('exist');
    cy.getByCy(`cart-product`).should('have.length', 4);
  });
});
