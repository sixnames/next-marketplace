import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { getConsoleRubricLinks } from '../../../lib/linkUtils';

describe('Product variants', () => {
  const links = getConsoleRubricLinks({
    rubricSlug: fixtureIds.rubricWineSlug,
    productId: fixtureIds.wineProductA,
  });
  beforeEach(() => {
    cy.testAuth(links.product.variants);
  });

  it('Should CRUD product variants', () => {
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
    cy.getByCy('0-1-delete').click();
    cy.getByCy('confirm').click();
    cy.wait(1500);

    // delete second product
    cy.getByCy('0-0-delete').click();
    cy.getByCy('confirm').click();
    cy.wait(1500);

    cy.getByCy('Объем-connection-product-create').should('not.exist');
  });
});
