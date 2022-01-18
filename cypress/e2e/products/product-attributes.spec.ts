import { ROUTE_CMS } from 'config/common';

describe('Product attributes', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  it('Should CRUD product attributes', () => {
    cy.getByCy(`Вино-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.visitLinkHref('product-link-0');
    cy.wait(1500);
    cy.getByCy('product-details').should('exist');
    cy.getByCy('attributes').click();
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');

    // clear select attribute
    cy.getByCy('Объем-attribute-clear').click();
    cy.wait(1500);

    // open options modal
    cy.getByCy('Объем-attribute').click();
    cy.getByCy('select-attribute-options-modal').should('exist');
    cy.getByCy('option-350').click();
    cy.wait(1500);

    // clear multi-select attribute
    cy.getByCy('Виноград-attribute-clear').click();
    cy.wait(1500);

    // open options modal
    cy.getByCy('Виноград-attribute').click();
    cy.getByCy('multi-select-attribute-options-modal').should('exist');
    cy.getByCy('option-Бага').click();
    cy.getByCy('option-Бикал').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);

    // update number attributes
    cy.getByCy('Крепость-attribute').clear().type('10');
    cy.getByCy('Количество в упаковке-attribute').clear().type('10');
    cy.getByCy('submit-number-attributes').click();
    cy.wait(1500);

    // update text attributes
    cy.getByCy('Текстовый-attribute-ru').clear().type('lorem');
    cy.getByCy('submit-text-attributes').click();
  });
});
