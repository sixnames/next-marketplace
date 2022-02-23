import { fixtureIds } from 'cypress/fixtures/fixtureIds';

describe('Product variants', () => {
  const links = getProjectLinks({
    rubricSlug: fixtureIds.rubricWineSlug,
    productId: fixtureIds.wineProductA,
  });
  beforeEach(() => {
    cy.testAuth(links.product.variants);
  });

  it('Should CRUD product variants', () => {
    cy.getByCy('product-variants-list').should('exist');

    // create variant
    cy.getByCy('create-variant').click();
    cy.getByCy('create-variant-modal').should('exist');
    cy.selectOptionByTestId('attributeId', 'Объем');
    cy.getByCy('create-variant-submit').click();
    cy.wait(1500);

    // add variant product
    cy.getByCy('Объем-variant-product-create').click();
    cy.getByCy('add-product-to-variant-modal').should('exist');
    cy.getByCy('product-search-list-0-row').then(($row: any) => {
      const button = $row.find('button');
      cy.wrap(button).click();
    });
    cy.wait(1500);

    // delete first product
    cy.getByCy('0-1-delete').click();
    cy.getByCy('confirm').click();
    cy.wait(1500);

    // delete second product
    cy.getByCy('0-0-delete').click();
    cy.getByCy('confirm').click();
    cy.wait(1500);

    cy.getByCy('Объем-variant-product-create').should('not.exist');
  });
});
