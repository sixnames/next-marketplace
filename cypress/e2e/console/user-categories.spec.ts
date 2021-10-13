import { DEFAULT_LOCALE, ROUTE_CONSOLE } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

describe('User categories', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CONSOLE}/${fixtureIds.companyA}/user-categories`, 'ownerA@gmail.com');
  });

  it('Should CRUD user categories', () => {
    const newCategoryName = 'newCategoryName';
    const updatedCategoryName = 'updatedCategoryName';
    const newPercentValue = '22';
    const updatedPercentValue = '52';
    const newChargeValue = '999';
    const updatedChargeValue = '9999';

    cy.getByCy('user-categories-list').should('exist');

    // should create
    cy.getByCy('create-user-category').click();
    cy.getByCy('user-category-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newCategoryName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(newCategoryName);
    cy.getByCy(`discountPercent`).type(newPercentValue);
    cy.getByCy(`cashbackPercent`).type(newPercentValue);
    cy.getByCy(`payFromCashbackPercent`).type(newPercentValue);
    cy.getByCy(`entryMinCharge`).type(newChargeValue);
    cy.getByCy('submit-user-category').click();
    cy.wait(1500);
    cy.getByCy(`${newCategoryName}-row`).should('exist');

    // should update
    cy.getByCy(`${newCategoryName}-update`).click();
    cy.getByCy('user-category-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedCategoryName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedCategoryName);
    cy.getByCy(`discountPercent`).clear().type(updatedPercentValue);
    cy.getByCy(`cashbackPercent`).clear().type(updatedPercentValue);
    cy.getByCy(`payFromCashbackPercent`).clear().type(updatedPercentValue);
    cy.getByCy(`entryMinCharge`).clear().type(updatedChargeValue);
    cy.getByCy('submit-user-category').clear().click();
    cy.wait(1500);
    cy.getByCy(`${newCategoryName}-row`).should('not.exist');
    cy.getByCy(`${updatedCategoryName}-row`).should('exist');

    // should delete
    cy.getByCy(`${newCategoryName}-delete`).click();
    cy.getByCy('delete-user-category-modal').should('exist');
    cy.getByCy('delete').click();
    cy.wait(1500);
    cy.getByCy(`${updatedCategoryName}-row`).should('not.exist');
  });
});
