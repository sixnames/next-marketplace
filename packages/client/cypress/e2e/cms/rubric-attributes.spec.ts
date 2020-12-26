/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import {
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_TWO_A,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
  MOCK_ATTRIBUTE_WINE_COLOR,
  MOCK_ATTRIBUTE_STRING,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
} from '@yagu/shared';

describe('Rubric attributes', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD rubric attributes list', () => {
    const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
    const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO_A.name[0].value;
    const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE_A_A.name[0].value;

    const mockAttributesGroup = MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name[0].value;
    const mockMultipleSelectAttribute = MOCK_ATTRIBUTE_WINE_COLOR.name[0].value;
    const mockStringAttribute = MOCK_ATTRIBUTE_STRING.name[0].value;
    const mockAttributesGroupForDelete = MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name[0].value;

    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');

    // Should update attributes group only in one rubric
    cy.getByCy(`${mockStringAttribute}-checkbox`).should('be.disabled');
    cy.getByCy(`${mockMultipleSelectAttribute}-checkbox`).click();
    cy.shouldSuccess();
    cy.getByCy(`${mockMultipleSelectAttribute}-checkbox`).should('not.be.checked');
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockMultipleSelectAttribute}-checkbox`).should('be.checked');

    // Should delete attributes group from owner list only
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroup}-delete`).should('be.disabled');
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroup}-delete`).should('be.disabled');
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroup}-delete`).click();
    cy.getByCy(`attributes-group-delete-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${mockAttributesGroup}-delete`).should('not.exist');

    // Shouldn't contain deleted attribute group on children rubrics
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroup}-delete`).should('not.exist');
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroup}-delete`).should('not.exist');

    // Should show validation error on add attributes group to the list
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockRubricLevelTwoName}-create`).click();
    cy.getByCy(`add-attributes-group-to-rubric-modal`).should('exist');
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('attributesGroupId-error').should('exist');

    // Should add attributes group to the list
    cy.selectOptionByTestId('attributes-groups', mockAttributesGroupForDelete);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDelete);
    cy.getByCy(`${mockStringAttribute}-checkbox`).should('be.disabled');
    cy.getByCy(`${mockMultipleSelectAttribute}-checkbox`).should('be.checked');

    // Should have new attribute group on third level only
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('not.contain', mockAttributesGroupForDelete);
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDelete);
  });
});
