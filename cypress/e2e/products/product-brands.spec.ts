import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Rubric products', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.rubrics.url);
  });

  it('Should CRUD product brands', () => {
    cy.getByCy(`Вино-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.visitLinkHref('product-link-0');
    cy.wait(1500);
    cy.getByCy('brands').click();
    cy.wait(1500);
    cy.getByCy('product-brands-list').should('exist');

    // brand
    cy.getByCy('brand-input-clear').click();
    cy.wait(1500);
    cy.getByCy('brand-collection-input').should('contain', 'Не назначено');
    cy.getByCy('brand-input').click();
    cy.getByCy('brand-options-modal').should('exist');
    cy.getByCy('option-Brand B').click();
    cy.wait(1500);
    cy.getByCy('brand-input').should('contain', 'Brand B');

    // brand collection
    cy.getByCy('brand-collection-input').click();
    cy.getByCy('brand-collection-options-modal').should('exist');
    cy.getByCy('option-Brand collection B').click();
    cy.wait(1500);
    cy.getByCy('brand-collection-input').should('contain', 'Brand collection B');

    // manufacturer
    cy.getByCy('manufacturer-input-clear').click();
    cy.wait(1500);
    cy.getByCy('manufacturer-input').click();
    cy.getByCy('manufacturer-options-modal').should('exist');
    cy.getByCy('option-Manufacturer B').click();
    cy.wait(1500);
    cy.getByCy('manufacturer-input').should('contain', 'Manufacturer B');
  });
});
