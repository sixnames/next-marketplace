/// <reference types="cypress" />
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';
import { getTestLangField } from '../../../utils/getLangField';

describe('Rubric attributes', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/app/cms/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD rubric attributes list', () => {
    const mockRubricLevelOneName = getTestLangField(mockData.rubricLevelOneA.name);
    const mockRubricLevelTwoName = getTestLangField(mockData.rubricLevelTwoA.name);
    const mockRubricLevelThreeName = getTestLangField(mockData.rubricLevelThreeAA.name);

    const mockAttributesGroupName = getTestLangField(mockData.attributesGroupWineFeatures.name);
    const mockMultipleSelectAttributeName = getTestLangField(mockData.attributeWineColor.name);
    const mockStringAttributeName = getTestLangField(mockData.attributeString.name);
    const mockAttributesGroupForDeleteName = getTestLangField(
      mockData.attributesGroupForDelete.name,
    );

    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');

    // Should update attributes group only in one rubric
    cy.getByCy(`${mockStringAttributeName}-checkbox`).should('be.disabled');
    cy.getByCy(`${mockMultipleSelectAttributeName}-checkbox`).click();
    cy.shouldSuccess();
    cy.getByCy(`${mockMultipleSelectAttributeName}-checkbox`).should('not.be.checked');
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockMultipleSelectAttributeName}-checkbox`).should('be.checked');

    // Should delete attributes group from owner list only
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroupName}-delete`).should('be.disabled');
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroupName}-delete`).should('be.disabled');
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroupName}-delete`).click();
    cy.getByCy(`attributes-group-delete-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${mockAttributesGroupName}-delete`).should('not.exist');

    // Shouldn't contain deleted attribute group on children rubrics
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroupName}-delete`).should('not.exist');
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroupName}-delete`).should('not.exist');

    // Should show validation error on add attributes group to the list
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockRubricLevelTwoName}-create`).click();
    cy.getByCy(`add-attributes-group-to-rubric-modal`).should('exist');
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('attributesGroupId-error').should('exist');

    // Should add attributes group to the list
    cy.selectOptionByTestId('attributes-groups', mockAttributesGroupForDeleteName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDeleteName);
    cy.getByCy(`${mockStringAttributeName}-checkbox`).should('be.disabled');
    cy.getByCy(`${mockMultipleSelectAttributeName}-checkbox`).should('be.checked');

    // Should have new attribute group on third level only
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('not.contain', mockAttributesGroupForDeleteName);
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDeleteName);
  });
});
