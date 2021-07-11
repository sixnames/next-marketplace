import { ROUTE_CMS } from 'config/common';

describe('Rubric products', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  it('Should CRUD product brands', () => {
    cy.getByCy(`Вино-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('product-link-0').click();
    cy.wait(1500);
    cy.getByCy('brands').click();
    cy.getByCy('product-brands-list').should('exist');

    // brand
    cy.getByCy('clear-brand').click();
    cy.wait(1500);
    cy.getByCy('brand-collection-input').should('contain', 'Не назначено');
    cy.getByCy('brand-input').click();
    cy.getByCy('brand-options-modal').should('exist');
    cy.getByCy('option-Brand B').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);
    cy.getByCy('brand-input').should('contain', 'Brand B');

    // brand collection
    cy.getByCy('brand-collection-input').click();
    cy.getByCy('brand-collection-options-modal').should('exist');
    cy.getByCy('option-Brand collection B').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);
    cy.getByCy('brand-collection-input').should('contain', 'Brand collection B');

    // manufacturer
    cy.getByCy('clear-manufacturer').click();
    cy.wait(1500);
    cy.getByCy('manufacturer-input').click();
    cy.getByCy('manufacturer-options-modal').should('exist');
    cy.getByCy('option-Manufacturer B').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);
    cy.getByCy('manufacturer-input').should('contain', 'Manufacturer B');
  });
});
