import { ADULT_KEY, ADULT_TRUE, ROUTE_CMS } from 'config/common';

describe('Rubric products', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  it('Should CRUD rubric product', () => {
    const mainRubricName = 'Вино';
    const newProductName = 'newProductName';
    const newProductDescription = 'newProductDescription';
    const updatedProductName = 'updatedProductName';
    const updatedProductDescription = 'updatedProductDescription';

    // Should add product to rubric
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy(`create-rubric-product`).click();
    cy.getByCy('create-new-product-modal').should('exist');
    cy.getByCy('nameI18n-ru').type(newProductName);
    cy.getByCy('originalName').type(newProductName);
    cy.getByCy('descriptionI18n-ru').type(newProductDescription);
    cy.getByCy(`submit-new-product`).click();
    cy.wait(1500);
    cy.getByCy('product-details').should('exist');

    // Should update rubric product
    cy.getByCy(`active-checkbox`).check();
    cy.getByCy('nameI18n-ru').clear().type(updatedProductName);
    cy.getByCy('originalName').clear().type(updatedProductName);
    cy.getByCy('descriptionI18n-ru').clear().type(updatedProductDescription);
    cy.getByCy(`submit-product`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedProductName}-product-title`).should('exist');

    // Should delete product from rubric
    cy.visit(`${ROUTE_CMS}/rubrics`);
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('products-search-input').type(updatedProductName);
    cy.getByCy('products-search-submit').click();
    cy.wait(1500);
    cy.getByCy(`${updatedProductName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy('products-search-input').type(updatedProductName);
    cy.getByCy('products-search-submit').click();
    cy.getByCy(`${updatedProductName}-delete`).should('not.exist');
  });

  it.only('Should CRUD product attributes', () => {
    const mainRubricName = 'Вино';

    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('product-link-0').click();
    cy.wait(1500);
    cy.getByCy('attributes').click();
    cy.getByCy('product-attributes-list').should('exist');
  });

  it('Should CRUD product connections', () => {
    cy.visit('/');
  });
});
