import { ROUTE_CMS } from 'config/common';

describe('Product categories', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  it('Should CRUD product categories', () => {
    cy.getByCy(`Виски-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('product-link-0').click();
    cy.wait(1500);

    // check attributes from category
    cy.getByCy('attributes').click();
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');
    cy.getByCy('Объем-attribute').should('exist');

    // remove product from category
    cy.getByCy('categories').click();
    cy.wait(1500);
    cy.getByCy('product-categories-list').should('exist');
    cy.getByCy('Односолодовый A-1-checkbox').click();
    cy.wait(1500);

    // check attributes from removed category
    cy.getByCy('attributes').click();
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');
    cy.getByCy('Объем-attribute').should('not.exist');
  });
});
