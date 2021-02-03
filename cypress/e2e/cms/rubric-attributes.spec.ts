import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Rubric attributes', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD rubric attributes list', () => {
    const mockRubricLevelOneName = mockData.rubricADefaultName;
    const mockRubricLevelTwoName = mockData.rubricADefaultName;

    const mockAttributesGroupName = mockData.attributesGroupWineFeatures.nameI18n[DEFAULT_LOCALE];
    const mockMultipleSelectAttributeName = mockData.attributeWineColor.nameI18n[DEFAULT_LOCALE];
    const mockStringAttributeName = mockData.attributeString.nameI18n[DEFAULT_LOCALE];
    const mockAttributesGroupForDeleteName =
      mockData.attributesGroupForDelete.nameI18n[DEFAULT_LOCALE];

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

    // Should show validation error on add attributes group to the list
    cy.getByCy(`${mockRubricLevelTwoName}-create`).click();
    cy.getByCy(`add-attributes-group-to-rubric-modal`).should('exist');
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('attributesGroupId-error').should('exist');

    // Should add attributes group to the list
    cy.selectOptionByTestId('attributes-groups', mockAttributesGroupForDeleteName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDeleteName);

    // Should have new attributes group on second level only
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('not.contain', mockAttributesGroupForDeleteName);
  });
});
