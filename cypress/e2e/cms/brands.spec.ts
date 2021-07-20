import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('Languages', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/brands`);
  });

  it(`Should CRUD brands`, () => {
    const newBrandName = 'newBrandName';
    const newBrandUrl = 'https://url.com';
    const updatedBrandName = 'updatedBrandName';
    const updatedBrandUrl = 'https://url2.com';

    const newBrandCollectionName = 'newBrandCollectionName';
    const updatedBrandCollectionName = 'updatedBrandCollectionName';

    // should create brand
    cy.getByCy('brands-list').should('exist');
    cy.getByCy('create-brand').click();
    cy.getByCy('create-brand-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newBrandName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(newBrandName);
    cy.getByCy(`url-0`).type(newBrandUrl);
    cy.getByCy('submit-brand').click();
    cy.wait(1500);
    cy.getByCy(`${newBrandName}-row`).should('exist');

    // should update brand
    cy.getByCy(`${newBrandName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`brand-details`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedBrandName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedBrandName);
    cy.getByCy(`url-0`).clear().type(updatedBrandUrl);
    cy.getByCy('submit-brand').click();

    // should create brand collection
    cy.getByCy('brand-collections').click();
    cy.wait(1500);
    cy.getByCy('brand-collections-page').should('exist');
    cy.getByCy('create-brand-collection').click();
    cy.getByCy('brand-collection-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newBrandCollectionName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(newBrandCollectionName);
    cy.getByCy('submit-brand-collection').click();
    cy.wait(1500);
    cy.getByCy(`${newBrandCollectionName}-row`).should('exist');

    // should updated brand collection
    cy.getByCy(`${newBrandCollectionName}-update`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedBrandCollectionName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedBrandCollectionName);
    cy.getByCy('submit-brand-collection').click();
    cy.wait(1500);
    cy.getByCy(`${updatedBrandCollectionName}-row`).should('exist');

    // should delete brand collection
    cy.getByCy(`${updatedBrandCollectionName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedBrandCollectionName}-row`).should('not.exist');

    // should delete brand
    cy.visit(`${ROUTE_CMS}/brands`);
    cy.getByCy(`${updatedBrandName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedBrandName}-row`).should('not.exist');
  });
});
