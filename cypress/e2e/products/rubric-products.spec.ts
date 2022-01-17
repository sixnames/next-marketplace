import { ROUTE_CMS } from 'config/common';

describe('Rubric products', () => {
  beforeEach(() => {
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
    cy.getByCy('nameI18n-ru').clear().type(updatedProductName);
    cy.getByCy('originalName').clear().type(updatedProductName);
    cy.getByCy('descriptionI18n-ru').clear().type(updatedProductDescription);
    cy.getByCy(`submit-product`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedProductName}-product-title`).should('exist');

    // Should display product assets page
    cy.getByCy('assets').click();
    cy.getByCy('product-assets-list').should('exist');

    // Should delete product from rubric
    cy.visit(`${ROUTE_CMS}/rubrics`);
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('products-search-input').clear().type(updatedProductName);
    cy.getByCy('products-search-submit').click();
    cy.wait(1500);
    cy.getByCy(`${updatedProductName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy('products-search-input').clear().type(updatedProductName);
    cy.getByCy('products-search-submit').click();
    cy.getByCy(`${updatedProductName}-delete`).should('not.exist');
  });
});
