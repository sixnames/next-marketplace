import {
  DEFAULT_LOCALE,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
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

  it('Should CRUD option in group', () => {
    const optionName = 'optionName';
    const childOptionName = 'childOptionName';
    const optionNewName = 'optionNewName';
    const optionNewColor = '#ff0000';

    // Should create top level option
    cy.getByCy(`Регион-update`).click();
    cy.wait(1500);
    cy.getByCy(`create-top-level-option`).click();
    cy.getByCy(`option-in-group-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(optionName);
    cy.getByCy(`option-gender`).select(GENDER_IT);
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).type(optionName);
    cy.getByCy(`variant-${GENDER_SHE}-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`variant-${GENDER_SHE}-${SECONDARY_LOCALE}`).type(optionName);

    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).type(optionName);
    cy.getByCy(`variant-${GENDER_HE}-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`variant-${GENDER_HE}-${SECONDARY_LOCALE}`).type(optionName);

    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).type(optionName);
    cy.getByCy(`variant-${GENDER_IT}-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`variant-${GENDER_IT}-${SECONDARY_LOCALE}`).type(optionName);

    cy.getByCy(`option-submit`).click();
    cy.wait(1500);
    cy.getByCy(`option-${optionName}`).should('exist');

    // Should create second level option
    cy.getByCy(`${optionName}-create`).click();
    cy.getByCy(`option-in-group-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(childOptionName);
    cy.getByCy(`option-gender`).select(GENDER_IT);
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).type(childOptionName);
    cy.getByCy(`variant-${GENDER_SHE}-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`variant-${GENDER_SHE}-${SECONDARY_LOCALE}`).type(childOptionName);

    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).type(childOptionName);
    cy.getByCy(`variant-${GENDER_HE}-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`variant-${GENDER_HE}-${SECONDARY_LOCALE}`).type(childOptionName);

    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).type(childOptionName);
    cy.getByCy(`variant-${GENDER_IT}-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`variant-${GENDER_IT}-${SECONDARY_LOCALE}`).type(childOptionName);

    cy.getByCy(`option-submit`).click();
    cy.wait(1500);
    cy.getByCy(`option-${childOptionName}`).should('exist');

    // Should delete top level option and option children
    cy.getByCy(`${optionName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`option-${optionName}`).should('not.exist');
    cy.getByCy(`option-${childOptionName}`).should('not.exist');

    // Should update color option
    cy.visit(`${ROUTE_CMS}/options`);
    cy.getByCy(`Тип вина-update`).click();
    cy.wait(1500);
    cy.getByCy(`Крепленое-update`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    cy.getByCy(`option-color`).invoke('val', optionNewColor).trigger('change');
    cy.getByCy(`option-gender`).select(GENDER_SHE);
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    cy.getByCy(`option-submit`).click();

    // Should update icon option
    cy.visit(`${ROUTE_CMS}/options`);
    cy.getByCy(`Сахар-update`).click();
    cy.wait(1500);
    cy.getByCy(`Сладкое-update`).click();
    cy.getByCy(`option-icon`).click();
    cy.getByCy(`instagram`).click();
    cy.getByCy(`option-submit`).click();
  });
});
