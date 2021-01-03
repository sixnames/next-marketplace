/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import {
  DEFAULT_LANG,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  iconTypesList,
  OPTIONS_GROUP_VARIANT_ICON,
  SECONDARY_LANG,
} from '@yagu/shared';
import * as faker from 'faker';
import { getTestLangField } from '../../../utils/getLangField';

describe('Options Groups', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/app/cms/options-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD options group', () => {
    const mockGroupName = getTestLangField(mockData.optionsGroupColors.name);
    const optionName = faker.commerce.color();
    const createdGroupName = faker.commerce.department();
    const groupNewName = faker.commerce.department();
    const optionColor = '333333';
    const fakeName = faker.random.alpha();

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
    const mockGroupName = getTestLangField(mockData.optionsGroupColors.name);
    const colorOption = mockData.optionsColor[0];
    const mockOptionName = getTestLangField(colorOption.name);
    const mockOptionColor = colorOption.color;
    const fakeName = faker.random.alpha();
    const fakeColor = faker.random.alpha();
    const optionNewName = faker.commerce.color();

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
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LANG}`).type(optionNewName);
    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LANG}`).type(optionNewName);
    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LANG}`).type(optionNewName);
    cy.getByCy(`option-color`).clear().type(mockOptionColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${mockOptionName}-row`).should('have.length', 1);
  });

  it('Should CRUD option in group', () => {
    const mockGroupName = getTestLangField(mockData.optionsGroupColors.name);
    const colorOption = mockData.optionsColor[0];
    const mockOptionName = getTestLangField(colorOption.name);
    const mockOptionColor = colorOption.color;
    const optionNewName = faker.commerce.color();
    const optionNewColor = 'fafafa';

    cy.getByCy(`group-${mockGroupName}`).click();

    // Should update option name in group
    cy.getByCy(`${mockOptionName}-option-update`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`)
      .should('have.value', mockOptionName)
      .clear()
      .type(optionNewName);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${mockOptionName}-row`).should('not.exist');
    cy.getByCy(`${optionNewName}-row`).should('exist');

    // Should update all option fields
    cy.getByCy(`${optionNewName}-option-update`).click();
    cy.getByCy(`option-color`).should('have.value', mockOptionColor).clear().type(optionNewColor);
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
