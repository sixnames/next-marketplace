/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';

describe('Options Groups', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/options-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD options group', () => {
    cy.getMockData(({ MOCK_OPTIONS_GROUP_COLORS }) => {
      const mockGroupName = MOCK_OPTIONS_GROUP_COLORS.name[0].value;
      const createdGroupName = 'new_group';
      const groupNewName = 'updated_name';
      const fakeName = 'f';

      cy.getByCy(`create-options-group`).click();

      // Should show validation error on not valid options group name
      cy.getByCy(`name-ru`).type(fakeName);
      cy.getByCy(`options-group-submit`).click();
      cy.getByCy(`name[0].value-error`).should('exist');

      // Should create group
      cy.getByCy(`name-ru`).clear().type(createdGroupName);
      cy.getByCy(`options-group-submit`).click();
      cy.getByCy(`options-group-modal`).should('not.exist');
      cy.getByCy(`group-${createdGroupName}`).should('exist');

      // Should update group title on groups filter click
      cy.getByCy(`group-${createdGroupName}`).click();
      cy.getByCy(`group-title`).contains(createdGroupName).should('exist');

      // Should update options group
      cy.getByCy(`options-group-update`).click();
      cy.getByCy(`name-ru`).should('have.value', createdGroupName).clear().type(groupNewName);
      cy.getByCy(`name-accordion-en`).click();
      cy.getByCy(`name-en`).clear().type(groupNewName);
      cy.getByCy(`options-group-submit`).click();
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
  });

  it('Should validate option inputs', () => {
    cy.getMockData(
      ({
        MOCK_OPTIONS_GROUP_COLORS,
        MOCK_OPTIONS_WINE_COLOR,
        GENDER_SHE,
        GENDER_HE,
        GENDER_IT,
      }) => {
        const mockGroupName = MOCK_OPTIONS_GROUP_COLORS.name[0].value;
        const mockOptionName = MOCK_OPTIONS_WINE_COLOR[0].name[0].value;
        const mockOptionColor = MOCK_OPTIONS_WINE_COLOR[0].color;
        const fakeName = 'f';
        const fakeColor = 'b';
        const optionName = 'option';

        // Shouldn't create option in group on validation error
        cy.getByCy(`group-${mockGroupName}`).click();
        cy.getByCy(`options-group-create`).click();
        cy.getByCy(`name-ru`).type(fakeName);
        cy.getByCy(`option-color`).type(fakeColor);
        cy.getByCy(`option-submit`).click();
        cy.getByCy(`name[0].value-error`).should('exist');
        cy.getByCy(`variants[0].value[0].value-error`).should('exist');
        cy.getByCy(`variants[1].value[0].value-error`).should('exist');
        cy.getByCy(`variants[2].value[0].value-error`).should('exist');
        cy.getByCy(`color-error`).should('exist');

        //Shouldn't create option in group if there is an option with the same name
        cy.getByCy(`name-ru`).clear().type(mockOptionName);
        cy.getByCy(`option-gender`).select(GENDER_SHE);
        cy.getByCy(`variant-${GENDER_SHE}-ru`).type(optionName);
        cy.getByCy(`variant-${GENDER_HE}-ru`).type(optionName);
        cy.getByCy(`variant-${GENDER_IT}-ru`).type(optionName);
        cy.getByCy(`option-color`).clear().type(mockOptionColor);
        cy.getByCy(`option-submit`).click();
        cy.getByCy(`${mockOptionName}`).should('have.length', 1);
      },
    );
  });

  it('Should CRUD option in group', () => {
    cy.getMockData(({ MOCK_OPTIONS_GROUP_COLORS, GENDER_SHE, GENDER_HE, GENDER_IT }) => {
      const mockGroupName = MOCK_OPTIONS_GROUP_COLORS.name[0].value;
      const optionName = 'option';
      const optionColor = '333333';
      const optionNewName = 'new_option_name';
      const optionNewColor = 'fafafa';

      cy.getByCy(`group-${mockGroupName}`).click();

      //Should create option in group
      cy.getByCy(`options-group-create`).click();
      cy.getByCy(`name-ru`).type(optionName);
      cy.getByCy(`option-gender`).select(GENDER_IT);
      cy.getByCy(`option-color`).type(optionColor);

      cy.getByCy(`variant-${GENDER_SHE}-ru`).type(optionName);
      cy.getByCy(`variant-${GENDER_SHE}-accordion-en`).click();
      cy.getByCy(`variant-${GENDER_SHE}-en`).type(optionName);

      cy.getByCy(`variant-${GENDER_HE}-ru`).type(optionName);
      cy.getByCy(`variant-${GENDER_HE}-accordion-en`).click();
      cy.getByCy(`variant-${GENDER_HE}-en`).type(optionName);

      cy.getByCy(`variant-${GENDER_IT}-ru`).type(optionName);
      cy.getByCy(`variant-${GENDER_IT}-accordion-en`).click();
      cy.getByCy(`variant-${GENDER_IT}-en`).type(optionName);

      cy.getByCy(`option-submit`).click();
      cy.getByCy(`${optionName}`).should('exist');

      // Should update option name in group
      cy.getByCy(`${optionName}-option-update`).click();
      cy.getByCy(`name-ru`).should('have.value', optionName).clear().type(optionNewName);
      cy.getByCy(`option-submit`).click();
      cy.getByCy(`${optionName}`).should('not.exist');
      cy.getByCy(`${optionNewName}`).should('exist');

      // Should update all option fields
      cy.getByCy(`${optionNewName}-option-update`).click();
      cy.getByCy(`option-color`).should('have.value', optionColor).clear().type(optionNewColor);
      cy.getByCy(`option-gender`).should('have.value', GENDER_IT).select(GENDER_SHE);
      cy.getByCy(`variant-${GENDER_SHE}-ru`)
        .should('have.value', optionName)
        .clear()
        .type(optionNewName);
      cy.getByCy(`variant-${GENDER_HE}-ru`)
        .should('have.value', optionName)
        .clear()
        .type(optionNewName);
      cy.getByCy(`variant-${GENDER_IT}-ru`)
        .should('have.value', optionName)
        .clear()
        .type(optionNewName);
      cy.getByCy(`option-submit`).click();
      cy.getByCy(`${optionNewName}`).should('exist');
      cy.getByCy(`${optionNewName}-${optionNewColor}`).should('exist');

      // Should delete option from group
      cy.getByCy(`${optionNewName}-option-delete`).click();
      cy.getByCy(`confirm`).click();
      cy.getByCy(`${optionNewName}`).should('not.exist');
    });
  });
});
