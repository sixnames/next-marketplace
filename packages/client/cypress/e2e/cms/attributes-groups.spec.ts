/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import {
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_OPTIONS_GROUP_COLORS,
} from '@yagu/mocks';
import {
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  SECONDARY_LANG,
  DEFAULT_LANG,
} from '@yagu/config';

describe('Attributes Groups', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/attributes-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD attributes group', () => {
    const mockGroupName = MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name[0].value;
    const mockGroupForDeleteName = MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name[0].value;
    const createdGroupName = 'new_group';
    const updatedGroupName = 'updated_group';
    const fakeName = 'f';

    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`attributes-group-modal`).should('exist');

    // Should show validation error on not valid attributes group name
    cy.getByCy(`name-${DEFAULT_LANG}`).type(fakeName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Should create a new attributes group
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(createdGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy(`group-${createdGroupName}`).click();
    cy.getByCy(`group-title`).contains(createdGroupName).should('exist');

    // Should show validation error on not valid attributes group update
    cy.getByCy(`attributes-group-update`).click();
    cy.getByCy(`name-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`)
      .should('have.value', createdGroupName)
      .clear()
      .type(fakeName);
    cy.getByCy(`name-${SECONDARY_LANG}`).type(fakeName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Should update attributes group
    cy.getByCy(`name-${DEFAULT_LANG}`).clear().type(updatedGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.contains(updatedGroupName).should('exist');

    // Shouldn't delete attributes group connected to the rubric
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-delete`).click();
    cy.getByCy(`delete-attributes-group-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(mockGroupName).should('exist');
    cy.getByCy(`group-${mockGroupName}`).should('exist');

    // Should delete attributes group
    cy.getByCy(`group-${mockGroupForDeleteName}`).click();
    cy.getByCy(`attributes-group-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.contains(mockGroupForDeleteName).should('not.exist');
    cy.getByCy(`group-${mockGroupForDeleteName}`).should('not.exist');
  });

  it('Should CRUD attribute in group', () => {
    const mockGroupName = MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name[0].value;
    const mockOptionsGroupName = MOCK_OPTIONS_GROUP_COLORS.name[0].value;
    const mockAttributeNewName = 'new_attribute';
    const updatedAttributeName = 'updated_attribute';

    // Shouldn't create attribute in group on validation error
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-create`).click();

    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`variant-error`).should('exist');

    cy.getByCy(`attribute-variant`).select(ATTRIBUTE_VARIANT_SELECT);
    cy.getByCy(`positioningInTitle[0].value-error`).should('exist');

    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`optionsGroup-error`).should('exist');

    // Should create attribute in group
    cy.getByCy(`name-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`name-${DEFAULT_LANG}`).type(mockAttributeNewName);
    cy.getByCy(`name-${SECONDARY_LANG}`).type(mockAttributeNewName);
    cy.selectOptionByTestId(`attribute-options`, mockOptionsGroupName);
    cy.getByCy(`positioningInTitle-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`positioningInTitle-${DEFAULT_LANG}`).select(ATTRIBUTE_POSITION_IN_TITLE_BEGIN);
    cy.getByCy(`positioningInTitle-${SECONDARY_LANG}`).select(
      ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
    );
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}-row`).should('exist');

    // Should update attribute in group
    cy.getByCy(`${mockAttributeNewName}-attribute-update`).click();

    cy.getByCy(`name-${DEFAULT_LANG}`)
      .should('have.value', mockAttributeNewName)
      .clear()
      .type(updatedAttributeName);
    cy.getByCy(`attribute-variant`).select(ATTRIBUTE_VARIANT_SELECT);
    cy.selectNthOption(`[data-cy=attribute-metrics]`, 3);
    cy.getByCy(`positioningInTitle-${DEFAULT_LANG}`).select(ATTRIBUTE_POSITION_IN_TITLE_END);
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}-row`).should('not.exist');
    cy.getByCy(`${updatedAttributeName}-row`).should('exist');

    // Should delete attribute from group
    cy.getByCy(`${updatedAttributeName}-attribute-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${updatedAttributeName}`).should('not.exist');
  });
});
