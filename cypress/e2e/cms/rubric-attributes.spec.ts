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
    const rubricAName = mockData.rubricADefaultName;

    const mockAttributesGroupName = mockData.attributesGroupWineFeatures.nameI18n[DEFAULT_LOCALE];
    const mockMultipleSelectAttributeName = mockData.attributeWineColor.nameI18n[DEFAULT_LOCALE];
    const mockStringAttributeName = mockData.attributeString.nameI18n[DEFAULT_LOCALE];
    const mockAttributesGroupForDeleteName =
      mockData.attributesGroupForDelete.nameI18n[DEFAULT_LOCALE];

    cy.getByCy(`${rubricAName}-update`).click();
    cy.visitMoreNavLink('attributes');

    // Should update attributes group only in one rubric
    cy.getByCy(`${mockStringAttributeName}-filter-checkbox`).should('be.disabled');
    cy.getByCy(`${mockMultipleSelectAttributeName}-filter-checkbox`).click();
    cy.shouldSuccess();
    cy.getByCy(`${mockMultipleSelectAttributeName}-filter-checkbox`).should('not.be.checked');
    cy.getByCy(`${mockMultipleSelectAttributeName}-nav-checkbox`).click();
    cy.shouldSuccess();
    cy.getByCy(`${mockMultipleSelectAttributeName}-nav-checkbox`).should('not.be.checked');

    // Should delete attributes group from rubric
    cy.getByCy(`${mockAttributesGroupName}-delete`).click();
    cy.getByCy(`attributes-group-delete-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${mockAttributesGroupName}-delete`).should('not.exist');

    // Should show validation error on add attributes group to the list
    cy.getByCy(`${rubricAName}-create`).click();
    cy.getByCy(`add-attributes-group-to-rubric-modal`).should('exist');
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('attributesGroupId-error').should('exist');

    // Should add attributes group to the list
    cy.selectOptionByTestId('attributes-groups', mockAttributesGroupForDeleteName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDeleteName);
  });
});
