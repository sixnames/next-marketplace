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
    cy.getByCy(`card-${mockData.productA.slug}`).should('exist');
    cy.getByCy(`card-tabs-1`).click();
    cy.getByCy(`card-shops`).should('exist');
    cy.getByCy(`card-shops-list`).should('exist');
    cy.getByCy(`card-shops-${mockData.shopA.slug}-plus`).click();
    cy.getByCy(`card-shops-${mockData.shopA.slug}-input`).should('have.value', '2');
    cy.getByCy(`card-shops-${mockData.shopA.slug}-add-to-cart`).click();

    // Add same product
    cy.getByCy(`cart-modal`).should('exist');
    cy.getByCy(`close-modal`).click();
    cy.getByCy(`card-shops-${mockData.shopA.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-counter`).should('contain', '1');
  });
});
