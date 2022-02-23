import { getProjectLinks } from 'lib/links/getProjectLinks';
import { fixtureIds } from '../../fixtures/fixtureIds';

describe('Product categories', () => {
  const links = getProjectLinks({
    rubricSlug: fixtureIds.rubricWhiskeySlug,
  });
  beforeEach(() => {
    cy.testAuth(links.cms.rubrics.rubricSlug.products.url);
  });

  it('Should CRUD product categories', () => {
    cy.visitBlank('product-link-0', 'attributes');
    cy.wait(1500);

    // check attribute in cms product
    cy.getByCy('product-attributes-list').should('exist');
    cy.getByCy('Объем-attribute').should('not.exist');

    // hide attribute in cms product card
    cy.visit(links.cms.rubrics.rubricSlug.categories.url);
    cy.visitBlank('Односолодовый');
    cy.getByCy('attributes').click();
    cy.wait(1500);
    cy.getByCy('category-attributes').should('exist');
    cy.getByCy('Объем-checkbox').check();
    cy.wait(1500);
    cy.getByCy('Объем-checkbox').should('be.checked');

    // check attribute in cms product
    cy.testAuth(links.cms.rubrics.rubricSlug.products.url);
    cy.visitBlank('product-link-0', 'attributes');
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');
    cy.getByCy('Объем-attribute').should('exist');

    // remove product from category
    cy.getByCy('categories').click();
    cy.wait(1500);
    cy.getByCy('product-categories-list').should('exist');
    cy.getByCy('Односолодовый A-1-checkbox').click();
    cy.wait(1500);
    cy.getByCy('Односолодовый A-1-checkbox').should('not.be.checked');
  });
});
