import { ADULT_KEY, ADULT_TRUE, ROUTE_CMS } from 'config/common';

describe('Options Groups', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`${ROUTE_CMS}/options`);
  });

  it('Should CRUD options group', () => {
    cy.visit('/');
    // const mockGroupName = mockData.optionsGroupColors.nameI18n[DEFAULT_LOCALE];
    // const optionName = 'optionName';
    // const createdGroupName = 'createdGroupName';
    // const groupNewName = 'groupNewName';
    // const optionColor = '333333';
    // const fakeName = 'f';
    //
    // cy.getByCy(`create-options-group`).click();
    //
    // Should show validation error on not valid options group name
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(fakeName);
    // cy.getByCy(`options-group-submit`).click();
    // cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');
    //
    // Should create group
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(createdGroupName);
    // cy.getByCy(`variant`).select(OPTIONS_GROUP_VARIANT_ICON);
    // cy.getByCy(`options-group-submit`).click();
    // cy.getByCy(`options-group-modal`).should('not.exist');
    // cy.getByCy(`optionsGroupId-${createdGroupName}`).should('exist');
    //
    // Should update group title on groups filter click
    // cy.getByCy(`optionsGroupId-${createdGroupName}`).click();
    // cy.getByCy(`group-title`).contains(createdGroupName).should('exist');
    //
    // Should create an option with icon
    // cy.getByCy(`options-group-create`).click();
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(optionName);
    // cy.getByCy(`option-color`).should('be.disabled');
    // cy.getByCy(`option-icon`).select(iconTypesList[0]);
    // cy.getByCy(`option-gender`).select(GENDER_IT);
    //
    // cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).type(optionName);
    // cy.getByCy(`variant-${GENDER_SHE}-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`variant-${GENDER_SHE}-${SECONDARY_LOCALE}`).type(optionName);
    //
    // cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).type(optionName);
    // cy.getByCy(`variant-${GENDER_HE}-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`variant-${GENDER_HE}-${SECONDARY_LOCALE}`).type(optionName);
    //
    // cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).type(optionName);
    // cy.getByCy(`variant-${GENDER_IT}-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`variant-${GENDER_IT}-${SECONDARY_LOCALE}`).type(optionName);
    //
    // cy.getByCy(`option-submit`).click();
    // cy.getByCy(`${optionName}-row`).should('exist');
    // cy.getByCy(`${optionName}-icon`).should('exist');

    // Should update options group
    // cy.getByCy(`options-group-update`).click();
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`)
    //   .should('have.value', createdGroupName)
    //   .clear()
    //   .type(groupNewName);
    // cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(groupNewName);
    // cy.getByCy(`options-group-submit`).click();
    // cy.contains(groupNewName).should('exist');

    // Should create an option with color
    // cy.getByCy(`optionsGroupId-${mockGroupName}`).click();
    // cy.getByCy(`options-group-create`).click();
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(optionName);
    // cy.getByCy(`option-gender`).select(GENDER_IT);
    // cy.getByCy(`option-color`).type(optionColor);
    //
    // cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).type(optionName);
    // cy.getByCy(`variant-${GENDER_SHE}-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`variant-${GENDER_SHE}-${SECONDARY_LOCALE}`).type(optionName);
    //
    // cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).type(optionName);
    // cy.getByCy(`variant-${GENDER_HE}-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`variant-${GENDER_HE}-${SECONDARY_LOCALE}`).type(optionName);
    //
    // cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).type(optionName);
    // cy.getByCy(`variant-${GENDER_IT}-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`variant-${GENDER_IT}-${SECONDARY_LOCALE}`).type(optionName);
    //
    // cy.getByCy(`option-submit`).click();
    // cy.getByCy(`${optionName}-row`).should('exist');
    // cy.getByCy(`${optionName}-${optionColor}`).should('exist');

    // Should delete option from group
    // cy.getByCy(`${optionName}-option-delete`).click();
    // cy.getByCy(`confirm`).click();
    // cy.getByCy(`${optionName}-row`).should('not.exist');

    // Shouldn't delete options group connected to the attribute
    // cy.getByCy(`options-group-delete`).click();
    // cy.getByCy(`delete-options-group`).should('exist');
    // cy.getByCy(`confirm`).click();
    // cy.contains(mockGroupName).should('exist');
    // cy.getByCy(`optionsGroupId-${mockGroupName}`).should('exist');

    // Should delete options group
    // cy.getByCy(`optionsGroupId-${groupNewName}`).click();
    // cy.getByCy(`options-group-delete`).click();
    // cy.getByCy(`confirm`).click();
    // cy.contains(groupNewName).should('not.exist');
    // cy.getByCy(`optionsGroupId-${groupNewName}`).should('not.exist');
  });

  it('Should validate option inputs', () => {
    cy.visit('/');
    // const mockGroupName = mockData.optionsGroupColors.nameI18n[DEFAULT_LOCALE];
    // const colorOption = mockData.optionsColor[0];
    // const mockOptionName = colorOption.nameI18n[DEFAULT_LOCALE];
    // const mockOptionColor = colorOption.color;
    // const fakeName = 'f';
    // const fakeColor = 'b';
    // const optionNewName = 'optionNewName';

    // Shouldn't create option in group on validation error
    // cy.getByCy(`optionsGroupId-${mockGroupName}`).click();
    // cy.getByCy(`options-group-create`).click();
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(fakeName);
    // cy.getByCy(`option-color`).type(fakeColor);
    // cy.getByCy(`option-submit`).click();
    // cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');
    // cy.getByCy(`color-error`).should('exist');

    //Shouldn't create option in group if there is an option with the same name
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(mockOptionName);
    // cy.getByCy(`option-gender`).select(GENDER_SHE);
    // cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).type(optionNewName);
    // cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).type(optionNewName);
    // cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).type(optionNewName);
    // cy.getByCy(`option-color`)
    //   .clear()
    //   .type(mockOptionColor || '');
    // cy.getByCy(`option-submit`).click();
    // cy.getByCy(`${mockOptionName}-row`).should('have.length', 1);
  });

  it('Should CRUD option in group', () => {
    cy.visit('/');
    // const mockGroupName = mockData.optionsGroupColors.nameI18n[DEFAULT_LOCALE];
    // const colorOption = mockData.optionsColor[0];
    // const mockOptionName = colorOption.nameI18n[DEFAULT_LOCALE];
    // const mockOptionColor = colorOption.color;
    // const optionNewName = 'optionNewName';
    // const optionNewColor = 'fafafa';

    // cy.getByCy(`optionsGroupId-${mockGroupName}`).click();

    // Should update option name in group
    // cy.getByCy(`${mockOptionName}-option-update`).click();
    // cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`)
    //   .should('have.value', mockOptionName)
    //   .clear()
    //   .type(optionNewName);
    // cy.getByCy(`option-submit`).click();
    // cy.getByCy(`${mockOptionName}-row`).should('not.exist');
    // cy.getByCy(`${optionNewName}-row`).should('exist');

    // Should update all option fields
    // cy.getByCy(`${optionNewName}-option-update`).click();
    // cy.getByCy(`option-color`).should('have.value', mockOptionColor).clear().type(optionNewColor);
    // cy.getByCy(`option-gender`).should('have.value', GENDER_HE).select(GENDER_SHE);
    // cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    // cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    // cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    // cy.getByCy(`option-submit`).click();
    // cy.getByCy(`${optionNewName}-row`).should('exist');
    // cy.getByCy(`${optionNewName}-${optionNewColor}`).should('exist');
  });
});
