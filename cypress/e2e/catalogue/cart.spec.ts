import { DEFAULT_CITY } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Cart', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.visit(`/${DEFAULT_CITY}/`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD cart items', () => {
    cy.visit(`/${DEFAULT_CITY}/${mockData.rubricA.slug}`);
    cy.getByCy('catalogue').should('exist');
    cy.getByCy(`catalogue-item-${mockData.productA._id}`).click();

    // Add product
    cy.getByCy(`card-${mockData.productA._id}`).should('exist');
    cy.getByCy(`card-tabs-shops`).click();
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
    cy.visit(`/${DEFAULT_CITY}/${mockData.rubricA.slug}`);
    cy.getByCy('catalogue').should('exist');
    cy.getByCy(`catalogue-item-${mockData.connectionProductA._id}`).click();
    cy.getByCy(`card-${mockData.connectionProductA._id}`).should('exist');
    cy.getByCy(`connection-${mockData.connectionProductB._id}`).click();
    cy.getByCy(`card-tabs-shops`).click();
    cy.getByCy(`card-shops-${mockData.shopB.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '2');
    cy.getByCy(`cart-counter`).should('contain', '2');

    // Add shopless product from catalogue
    cy.getByCy(`cart-modal-close`).click();
    cy.visit(`/${DEFAULT_CITY}/${mockData.rubricA.slug}`);
    cy.getByCy(`catalogue-item-${mockData.connectionProductA._id}-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '3');

    // Add shopless product from card
    cy.getByCy(`cart-modal-close`).click();
    cy.getByCy(`catalogue-item-${mockData.connectionProductC._id}`).click();
    cy.getByCy(`card-${mockData.connectionProductC._id}-plus`).click();
    cy.getByCy(`card-${mockData.connectionProductC._id}-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '4');

    // Should navigate to cart
    cy.getByCy(`cart-modal-continue`).click();
    cy.getByCy(`cart`).should('exist');
    cy.getByCy(`cart-counter`).should('contain', '4');
    cy.getByCy(`cart-products`).should('exist');
    cy.getByCy(`cart-product`).should('have.length', 4);

    // Should delete product form cart
    cy.getByCy(`${mockData.connectionProductC._id}-remove-from-cart`).click();
    cy.getByCy(`cart-product`).should('have.length', 3);

    // Should add shop to the shopless cart product
    cy.getByCy(`${mockData.connectionProductA._id}-show-shops`).click();
    cy.getByCy(`cart-shops-list`).should('exist');
    cy.getByCy(`cart-shops-${mockData.shopA.slug}-add-to-cart`).click();
    cy.getByCy(`cart-shops-list`).should('not.exist');
    cy.getByCy(`${mockData.connectionProductA._id}-show-shops`).should('not.exist');

    // Should update product amount
    cy.getByCy(`${mockData.productA._id}-plus`).click();
    cy.getByCy(`${mockData.productA._id}-amount`).should('have.value', '5');

    // Should have cart dropdown
    cy.visit(`/${DEFAULT_CITY}/${mockData.rubricA.slug}`);
    cy.getByCy('catalogue').should('exist');
    cy.getByCy(`cart-dropdown-trigger`).click();
    cy.getByCy(`cart-dropdown`).should('exist');

    // Should update product amount in dropdown
    cy.getByCy(`cart-dropdown-${mockData.productA._id}-minus`).click();
    cy.getByCy(`cart-dropdown-${mockData.productA._id}-amount`).should('have.value', '4');

    // Should delete cart product form dropdown
    cy.getByCy(`cart-dropdown-${mockData.productA._id}-remove-from-cart`).click();
    cy.getByCy(`cart-dropdown-${mockData.productA._id}-remove-from-cart`).should('not.exist');

    // Should remove all cart products
    cy.getByCy('clear-cart').click();
    cy.getByCy(`cart-dropdown`).should('not.exist');
    cy.getByCy(`cart-counter`).should('not.exist');
    cy.shouldSuccess();
  });
});
