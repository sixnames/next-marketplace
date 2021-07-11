import { ROUTE_CMS } from 'config/common';

describe('Rubric products', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  it('Should CRUD product connections', () => {
    cy.getByCy(`Вино-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('product-link-0').click();
    cy.wait(1500);
    cy.getByCy('connections').click();
    cy.getByCy('product-connections-list').should('exist');
    cy.getByCy('create-connection').click();
    cy.getByCy('create-connection-modal').should('exist');
    cy.selectOptionByTestId('attributeId', 'Объем');
    cy.getByCy('create-connection-submit').click();
    cy.wait(1500);
    cy.getByCy('Объем-connection-product-create').click();
    cy.getByCy('add-product-to-connection-modal').should('exist');
    cy.getByCy('product-search-list-0-row').then(($row: any) => {
      const button = $row.find('button');
      cy.wrap(button).click();
    });
    cy.wait(1500);

    // delete first product
    cy.getByCy('Объем-connection-list-0-row').then(($row: any) => {
      const button = $row.find('button');
      cy.wrap(button).click();
    });
    cy.getByCy('confirm').click();
    cy.wait(1500);

    // delete second product
    cy.getByCy('Объем-connection-list-0-row').then(($row: any) => {
      const button = $row.find('button');
      cy.wrap(button).click();
    });
    cy.getByCy('confirm').click();
    cy.wait(1500);

    cy.getByCy('Объем-connection-product-create').should('not.exist');
  });
});
