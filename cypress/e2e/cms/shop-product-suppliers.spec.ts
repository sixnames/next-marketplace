import { ROUTE_CMS } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

describe('Shop product suppliers', () => {
  const companiesPath = `${ROUTE_CMS}/companies/${fixtureIds.companyA}/shops/shop/${fixtureIds.shopA}/products/product/${fixtureIds.shopAShopProduct}/suppliers`;
  beforeEach(() => {
    cy.testAuth(companiesPath);
  });

  it('Should CRUD shop product suppliers', () => {
    cy.getByCy('shop-product-suppliers-list');
    const supplierAName = 'Supplier A';
    const supplierBName = 'Supplier B';

    // should add supplier
    cy.getByCy('add-supplier').click();
    cy.getByCy('shop-product-supplier-modal').should('exist');
    cy.selectOptionByTestId('supplierId', supplierAName);
    cy.selectOptionByTestId('variant', 'Дилерская наценка');
    cy.getByCy('supplier-price').clear().type('1000');
    cy.getByCy('supplier-percent').clear().type('10');
    cy.getByCy('submit-supplier-product').click();
    cy.wait(1500);
    cy.getByCy(`${supplierAName}-row`).should('exist');

    // should add second supplier
    cy.getByCy('add-supplier').click();
    cy.getByCy('shop-product-supplier-modal').should('exist');
    cy.selectOptionByTestId('supplierId', supplierBName);
    cy.selectOptionByTestId('variant', 'Дилерская скидка');
    cy.getByCy('supplier-price').clear().type('2000');
    cy.getByCy('supplier-percent').clear().type('50');
    cy.getByCy('submit-supplier-product').click();
    cy.wait(1500);
    cy.getByCy(`${supplierBName}-row`).should('exist');

    // should update first supplier
    cy.getByCy(`${supplierAName}-update`).click();
    cy.getByCy('shop-product-supplier-modal').should('exist');
    cy.getByCy('supplier-price').clear().type('2000');
    cy.getByCy('supplier-percent').clear().type('30');
    cy.getByCy('submit-supplier-product').click();
    cy.wait(1500);

    // should delete first supplier
    cy.getByCy(`${supplierAName}-delete`).click();
    cy.getByCy('delete-shop-product-supplier-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${supplierAName}-row`).should('not.exist');
  });
});
