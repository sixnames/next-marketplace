import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { DEFAULT_LOCALE } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('User categories', () => {
  const links = getProjectLinks({
    companyId: fixtureIds.companyA,
  });
  beforeEach(() => {
    cy.testAuth(links.console.companyId.userCategories.url, 'ownerA@gmail.com');
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
    cy.getByCy('submit-user-category').click();
    cy.wait(1500);
    cy.getByCy(`${newCategoryName}-row`).should('not.exist');
    cy.getByCy(`${updatedCategoryName}-row`).should('exist');

    // should delete
    cy.getByCy(`${updatedCategoryName}-delete`).click();
    cy.getByCy('delete-user-category-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedCategoryName}-row`).should('not.exist');
  });
});
