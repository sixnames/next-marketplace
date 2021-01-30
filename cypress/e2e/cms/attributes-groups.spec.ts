import {
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  DEFAULT_LOCALE,
  ROUTE_CMS,
  SECONDARY_LOCALE,
} from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Attributes Groups', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`${ROUTE_CMS}/attributes-groups`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD attributes group', () => {
    const mockGroupName = mockData.attributesGroupWineFeatures.nameI18n[DEFAULT_LOCALE];
    const mockGroupForDeleteName = mockData.attributesGroupForDelete.nameI18n[DEFAULT_LOCALE];
    const createdGroupName = 'createdGroupName';
    const updatedGroupName = 'updatedGroupName';
    const fakeName = 'f';

    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`attributes-group-modal`).should('exist');

    // Should show validation error on not valid attributes group name
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(fakeName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');

    // Should create a new attributes group
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(createdGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy(`attributesGroupId-${createdGroupName}`).click();
    cy.getByCy(`group-title`).contains(createdGroupName).should('exist');

    // Should show validation error on not valid attributes group update
    cy.getByCy(`attributes-group-update`).click();
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`)
      .should('have.value', createdGroupName)
      .clear()
      .type(fakeName);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).type(fakeName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');

    // Should update attributes group
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.contains(updatedGroupName).should('exist');

    // Shouldn't delete attributes group connected to the rubric
    cy.getByCy(`attributesGroupId-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-delete`).click();
    cy.getByCy(`delete-attributes-group-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(mockGroupName).should('exist');
    cy.getByCy(`attributesGroupId-${mockGroupName}`).should('exist');

    // Should delete attributes group
    cy.getByCy(`attributesGroupId-${mockGroupForDeleteName}`).click();
    cy.getByCy(`attributes-group-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`attributesGroupId-${mockGroupForDeleteName}`).should('not.exist');
    cy.getByCy(`attributesGroupId-${mockGroupForDeleteName}`).should('not.exist');
  });

  it('Should CRUD attribute in group', () => {
    const mockGroupName = mockData.attributesGroupWineFeatures.nameI18n[DEFAULT_LOCALE];
    const mockOptionsGroupName = mockData.optionsGroupColors.nameI18n[DEFAULT_LOCALE];
    const mockAttributeNewName = 'mockAttributeNewName';
    const updatedAttributeName = 'updatedAttributeName';

    // Shouldn't create attribute in group on validation error
    cy.getByCy(`attributesGroupId-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-create`).click();

    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`viewVariant-error`).should('exist');
    cy.getByCy(`variant-error`).should('exist');

    cy.getByCy(`attribute-viewVariant`).select(ATTRIBUTE_VIEW_VARIANT_ICON);
    cy.getByCy(`attribute-variant`).select(ATTRIBUTE_VARIANT_SELECT);
    cy.getByCy(`positioningInTitle.${DEFAULT_LOCALE}-error`).should('exist');

    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`optionsGroupId-error`).should('exist');

    // Should create attribute in group
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockAttributeNewName);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).type(mockAttributeNewName);
    cy.selectOptionByTestId(`attribute-options`, mockOptionsGroupName);
    cy.getByCy(`positioningInTitle-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`positioningInTitle-${DEFAULT_LOCALE}`).select(ATTRIBUTE_POSITION_IN_TITLE_BEGIN);
    cy.getByCy(`positioningInTitle-${SECONDARY_LOCALE}`).select(
      ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
    );
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}-row`).should('exist');
    cy.shouldSuccess();

    // Should update attribute in group
    cy.getByCy(`${mockAttributeNewName}-attribute-update`).click();

    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`)
      .should('have.value', mockAttributeNewName)
      .clear()
      .type(updatedAttributeName);
    cy.getByCy(`attribute-variant`).select(ATTRIBUTE_VARIANT_SELECT);
    cy.selectNthOption(`[data-cy=attribute-metrics]`, 3);
    cy.getByCy(`positioningInTitle-${DEFAULT_LOCALE}`).select(ATTRIBUTE_POSITION_IN_TITLE_END);
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}-row`).should('not.exist');
    cy.getByCy(`${updatedAttributeName}-row`).should('exist');
    cy.shouldSuccess();

    // Should delete attribute from group
    cy.getByCy(`${updatedAttributeName}-attribute-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${updatedAttributeName}-row`).should('not.exist');
    cy.shouldSuccess();
  });
});
