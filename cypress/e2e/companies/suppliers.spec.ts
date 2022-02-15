import { DEFAULT_LOCALE } from 'config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Suppliers', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.suppliers.url);
  });

  it(`Should CRUD suppliers`, () => {
    const newSupplierName = 'newSupplierName';
    const newSupplierUrl = 'https://url.com';
    const updatedSupplierName = 'updatedSupplierName';
    const updatedSupplierUrl = 'https://url2.com';

    // should create brand
    cy.getByCy('suppliers-list').should('exist');
    cy.getByCy('create-supplier').click();
    cy.getByCy('supplier-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newSupplierName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(newSupplierName);
    cy.getByCy(`url-0`).type(newSupplierUrl);
    cy.getByCy('submit-supplier').click();
    cy.wait(1500);
    cy.getByCy(`${newSupplierName}-row`).should('exist');

    // should update brand
    cy.getByCy(`${newSupplierName}-update`).click();
    cy.getByCy('supplier-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedSupplierName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedSupplierName);
    cy.getByCy(`url-0`).clear().type(updatedSupplierUrl);
    cy.getByCy('submit-supplier').click();

    // should delete brand
    cy.getByCy(`${updatedSupplierName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedSupplierName}-row`).should('not.exist');
  });
});
