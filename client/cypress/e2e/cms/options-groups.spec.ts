/// <reference types="cypress" />
import {
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_GROUP_COLORS,
  QUERY_DATA_LAYOUT_FILTER_ENABLED,
  GENDER_SHE,
  GENDER_HE,
  GENDER_IT,
} from '../../../config';

const mockGroupName = MOCK_OPTIONS_GROUP_COLORS.name[0].value;
const mockOptionName = MOCK_OPTIONS_WINE_COLOR[0].name[0].value;
const mockOptionColor = MOCK_OPTIONS_WINE_COLOR[0].color;
const createdGroupName = 'new_group';
const groupNewName = 'updated_name';
const fakeName = 'f';
const fakeColor = 'b';
const optionName = 'option';
const optionColor = '333333';
const optionNewName = 'new_option_name';
const optionNewColor = 'fafafa';

describe('Options Groups', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/options-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should CRUD options group', () => {
    cy.getByCy(`create-options-group`).click();

    // Should show validation error on not valid options group name
    cy.getByCy(`update-name-input`).type(fakeName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Should create group
    cy.getByCy(`update-name-input`).clear().type(createdGroupName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`create-options-group-modal`).should('not.exist');
    cy.getByCy(`group-${createdGroupName}`).should('exist');

    // Should update group title on groups filter click
    cy.getByCy(`group-${createdGroupName}`).click();
    cy.getByCy(`group-title`).contains(createdGroupName).should('exist');

    // Should update options group
    cy.getByCy(`options-group-update`).click();
    cy.getByCy(`update-name-input`)
      .should('have.value', createdGroupName)
      .clear()
      .type(groupNewName);
    cy.getByCy(`update-name-submit`).click();
    cy.contains(groupNewName).should('exist');

    // Shouldn't delete options group connected to the attribute
    cy.getByCy(`group-${mockGroupName}`).click();
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
    // Shouldn't create option in group on validation error
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-create`).click();
    cy.getByCy(`option-name`).type(fakeName);
    cy.getByCy(`option-color`).type(fakeColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`variants[0].value[0].value-error`).should('exist');
    cy.getByCy(`variants[1].value[0].value-error`).should('exist');
    cy.getByCy(`variants[2].value[0].value-error`).should('exist');
    cy.getByCy(`color-error`).should('exist');

    //Shouldn't create option in group if there is an option with the same name
    cy.getByCy(`option-name`).clear().type(mockOptionName);
    cy.getByCy(`option-gender`).select(GENDER_SHE);
    cy.getByCy(`option-${GENDER_SHE}`).type(optionName);
    cy.getByCy(`option-${GENDER_HE}`).type(optionName);
    cy.getByCy(`option-${GENDER_IT}`).type(optionName);
    cy.getByCy(`option-color`).clear().type(mockOptionColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${mockOptionName}`).should('have.length', 1);
  });

  it('Should CRUD option in group', () => {
    cy.getByCy(`group-${mockGroupName}`).click();

    //Should create option in group
    cy.getByCy(`options-group-create`).click();
    cy.getByCy(`option-name`).type(optionName);
    cy.getByCy(`option-gender`).select(GENDER_IT);
    cy.getByCy(`option-color`).type(optionColor);
    cy.getByCy(`option-${GENDER_SHE}`).type(optionName);
    cy.getByCy(`option-${GENDER_HE}`).type(optionName);
    cy.getByCy(`option-${GENDER_IT}`).type(optionName);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionName}`).should('exist');

    // Should update option name in group
    cy.getByCy(`${optionName}-option-update`).click();
    cy.getByCy(`option-name`).should('have.value', optionName).clear().type(optionNewName);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionName}`).should('not.exist');
    cy.getByCy(`${optionNewName}`).should('exist');

    // Should update all option fields
    cy.getByCy(`${optionNewName}-option-update`).click();
    cy.getByCy(`option-color`).should('have.value', optionColor).clear().type(optionNewColor);
    cy.getByCy(`option-gender`).should('have.value', GENDER_IT).select(GENDER_SHE);
    cy.getByCy(`option-${GENDER_SHE}`).should('have.value', optionName).type(optionNewName);
    cy.getByCy(`option-${GENDER_HE}`).should('have.value', optionName).type(optionNewName);
    cy.getByCy(`option-${GENDER_IT}`).should('have.value', optionName).type(optionNewName);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionNewName}`).should('exist');
    cy.getByCy(`${optionNewName}-${optionNewColor}`).should('exist');

    // Should delete option from group
    cy.getByCy(`${optionNewName}-option-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${optionNewName}`).should('not.exist');
  });
});
