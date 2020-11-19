/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import { MOCK_OPTIONS_GROUP_COLORS, MOCK_OPTIONS_WINE_COLOR } from '@yagu/mocks';
import {
  GENDER_SHE,
  GENDER_HE,
  GENDER_IT,
  DEFAULT_LANG,
  SECONDARY_LANG,
  OPTIONS_GROUP_VARIANT_ICON,
  iconTypesList,
} from '@yagu/config';

describe('Options Groups', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/options-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD options group', () => {
    const optionName = 'option';
    const mockGroupName = MOCK_OPTIONS_GROUP_COLORS.name[0].value;
    const createdGroupName = 'new_group';
    const groupNewName = 'updated_name';
    const optionColor = '333333';
    const fakeName = 'f';

    cy.getByCy(`create-options-group`).click();

    // Should show validation error on not valid options group name
    cy.getByCy(`name-${DEFAULT_LANG}`).type(fakeName);
    cy.getByCy(`options-group-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Should create group
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(createdGroupName);
    cy.getByCy(`variant`).select(OPTIONS_GROUP_VARIANT_ICON);
    cy.getByCy(`options-group-submit`).click();
    cy.getByCy(`options-group-modal`).should('not.exist');
    cy.getByCy(`group-${createdGroupName}`).should('exist');

    // Should update group title on groups filter click
    cy.getByCy(`group-${createdGroupName}`).click();
    cy.getByCy(`group-title`).contains(createdGroupName).should('exist');

    // Should create an option with icon
    cy.getByCy(`options-group-create`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`option-color`).should('be.disabled');
    cy.getByCy(`option-icon`).select(iconTypesList[0]);
    cy.getByCy(`option-gender`).select(GENDER_IT);

    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`variant-${GENDER_SHE}-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`variant-${GENDER_SHE}-${SECONDARY_LANG}`).type(optionName);

    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`variant-${GENDER_HE}-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`variant-${GENDER_HE}-${SECONDARY_LANG}`).type(optionName);

    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`variant-${GENDER_IT}-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`variant-${GENDER_IT}-${SECONDARY_LANG}`).type(optionName);

    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionName}-row`).should('exist');
    cy.getByCy(`${optionName}-icon`).should('exist');

    // Should update options group
    cy.getByCy(`options-group-update`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`)
      .should('have.value', createdGroupName)
      .clear()
      .type(groupNewName);
    cy.getByCy(`name-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`name-${SECONDARY_LANG}`).clear().type(groupNewName);
    cy.getByCy(`options-group-submit`).click();
    cy.contains(groupNewName).should('exist');

    // Should create an option with color
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-create`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`option-gender`).select(GENDER_IT);
    cy.getByCy(`option-color`).type(optionColor);

    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`variant-${GENDER_SHE}-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`variant-${GENDER_SHE}-${SECONDARY_LANG}`).type(optionName);

    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`variant-${GENDER_HE}-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`variant-${GENDER_HE}-${SECONDARY_LANG}`).type(optionName);

    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`variant-${GENDER_IT}-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`variant-${GENDER_IT}-${SECONDARY_LANG}`).type(optionName);

    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionName}-row`).should('exist');
    cy.getByCy(`${optionName}-${optionColor}`).should('exist');

    // Shouldn't delete options group connected to the attribute
    cy.getByCy(`options-group-delete`).click();
    cy.getByCy(`delete-options-group`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(mockGroupName).should('exist');
    cy.getByCy(`group-${mockGroupName}`).should('exist');

    // Should delete options group
    cy.getByCy(`group-${groupNewName}`).click();
    cy.getByCy(`options-group-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.contains(groupNewName).should('not.exist');
    cy.getByCy(`group-${groupNewName}`).should('not.exist');
  });

  it('Should validate option inputs', () => {
    const mockGroupName = MOCK_OPTIONS_GROUP_COLORS.name[0].value;
    const mockOptionName = MOCK_OPTIONS_WINE_COLOR[0].name[0].value;
    const mockOptionColor = MOCK_OPTIONS_WINE_COLOR[0].color;
    const fakeName = 'f';
    const fakeColor = 'b';
    const optionName = 'option';

    // Shouldn't create option in group on validation error
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-create`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(fakeName);
    cy.getByCy(`option-color`).type(fakeColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`variants[0].value[0].value-error`).should('exist');
    cy.getByCy(`variants[1].value[0].value-error`).should('exist');
    cy.getByCy(`variants[2].value[0].value-error`).should('exist');
    cy.getByCy(`color-error`).should('exist');

    //Shouldn't create option in group if there is an option with the same name
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(mockOptionName);
    cy.getByCy(`option-gender`).select(GENDER_SHE);
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LANG}`).type(optionName);
    cy.getByCy(`option-color`).clear().type(mockOptionColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${mockOptionName}-row`).should('have.length', 1);
  });

  it('Should CRUD option in group', () => {
    const mockGroupName = MOCK_OPTIONS_GROUP_COLORS.name[0].value;
    const optionName = MOCK_OPTIONS_WINE_COLOR[0].name[0].value;
    const optionColor = MOCK_OPTIONS_WINE_COLOR[0].color;
    const optionNewName = 'new_option_name';
    const optionNewColor = 'fafafa';

    cy.getByCy(`group-${mockGroupName}`).click();

    // Should update option name in group
    cy.getByCy(`${optionName}-option-update`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).should('have.value', optionName).clear().type(optionNewName);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionName}-row`).should('not.exist');
    cy.getByCy(`${optionNewName}-row`).should('exist');

    // Should update all option fields
    cy.getByCy(`${optionNewName}-option-update`).click();
    cy.getByCy(`option-color`).should('have.value', optionColor).clear().type(optionNewColor);
    cy.getByCy(`option-gender`).should('have.value', GENDER_HE).select(GENDER_SHE);
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LANG}`).clear().type(optionNewName);
    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LANG}`).clear().type(optionNewName);
    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LANG}`).clear().type(optionNewName);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionNewName}-row`).should('exist');
    cy.getByCy(`${optionNewName}-${optionNewColor}`).should('exist');

    // Should delete option from group
    cy.getByCy(`${optionNewName}-option-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${optionNewName}-row`).should('not.exist');
  });
});
