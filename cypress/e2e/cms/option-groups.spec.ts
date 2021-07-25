import {
  DEFAULT_LOCALE,
  OPTIONS_GROUP_VARIANT_ICON,
  ROUTE_CMS,
  SECONDARY_LOCALE,
} from 'config/common';

describe('Options Groups', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/options`);
  });

  it('Should CRUD options group', () => {
    const createdGroupName = 'createdGroupName';
    const groupNewName = 'groupNewName';

    // Should create group
    cy.getByCy(`create-options-group`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(createdGroupName);
    cy.getByCy(`variant`).select(OPTIONS_GROUP_VARIANT_ICON);
    cy.getByCy(`options-group-submit`).click();
    cy.getByCy(`options-group-modal`).should('not.exist');
    cy.wait(1500);
    cy.getByCy(`${createdGroupName}-row`).should('exist');

    // Should delete options group
    cy.getByCy(`${createdGroupName}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.wait(1500);
    cy.getByCy(`${createdGroupName}-row`).should('not.exist');

    // Should update options group
    cy.getByCy(`Регион-update`).click();
    cy.wait(1500);
    cy.getByCy('details').click();
    cy.wait(1500);
    cy.getByCy(`options-group-details`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`)
      .should('have.value', 'Регион')
      .clear()
      .type(groupNewName);
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(groupNewName);
    cy.getByCy(`options-group-submit`).click();
  });
});
