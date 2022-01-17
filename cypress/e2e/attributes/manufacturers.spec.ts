import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('Manufacturers', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/manufacturers`);
  });

  it(`Should CRUD manufacturers`, () => {
    const newManufacturerName = 'newManufacturerName';
    const newManufacturerUrl = 'https://url.com';
    const updatedManufacturerName = 'updatedManufacturerName';
    const updatedManufacturerUrl = 'https://url2.com';

    // should create brand
    cy.getByCy('manufacturers-list').should('exist');
    cy.getByCy('create-manufacturer').click();
    cy.getByCy('manufacturer-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newManufacturerName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(newManufacturerName);
    cy.getByCy(`url-0`).type(newManufacturerUrl);
    cy.getByCy('submit-manufacturer').click();
    cy.wait(1500);
    cy.getByCy(`${newManufacturerName}-row`).should('exist');

    // should update brand
    cy.getByCy(`${newManufacturerName}-update`).click();
    cy.getByCy('manufacturer-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedManufacturerName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedManufacturerName);
    cy.getByCy(`url-0`).clear().type(updatedManufacturerUrl);
    cy.getByCy('submit-manufacturer').click();

    // should delete brand
    cy.getByCy(`${updatedManufacturerName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedManufacturerName}-row`).should('not.exist');
  });
});
