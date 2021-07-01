import {
  ADULT_KEY,
  ADULT_TRUE,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  DEFAULT_LOCALE,
  ROUTE_CMS,
  SECONDARY_LOCALE,
} from 'config/common';

describe('Attributes Groups', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`${ROUTE_CMS}/attributes`);
  });

  it('Should CRUD attributes group', () => {
    const createdGroupName = 'createdGroupName';
    const updatedGroupName = 'updatedGroupName';
    const fakeName = 'f';

    const mockAttributeNewName = 'mockAttributeNewName';
    const updatedAttributeName = 'updatedAttributeName';

    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`attributes-group-modal`).should('exist');

    // Should show validation error on not valid attributes group name
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(fakeName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');

    // Should create a new attributes group
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(createdGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.wait(1500);

    // Should show validation error on not valid attributes group update
    cy.getByCy(`attributes-group-${createdGroupName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`sub-nav-details`).click();
    cy.wait(1500);
    cy.getByCy(`attributes-group-title`).contains(createdGroupName).should('exist');
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

    // Should CRUD attributes
    cy.getByCy(`sub-nav-attributes`).click();
    cy.wait(1500);
    cy.getByCy(`attributes-list`).should('exist');

    // Shouldn't create attribute in group on validation error
    cy.getByCy(`create-attribute`).click();
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
    cy.selectOptionByTestId(`attribute-options`, 'Год');
    cy.getByCy(`positioningInTitle-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`positioningInTitle-${DEFAULT_LOCALE}`).select(ATTRIBUTE_POSITION_IN_TITLE_BEGIN);
    cy.getByCy(`positioningInTitle-${SECONDARY_LOCALE}`).select(
      ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
    );
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}-row`).should('exist');

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

    // Should delete attribute from group
    cy.getByCy(`${updatedAttributeName}-attribute-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${mockAttributeNewName}-row`).should('not.exist');

    // Should delete attributes group
    cy.visit(`${ROUTE_CMS}/attributes`);
    cy.getByCy(`attributes-group-${updatedGroupName}-delete`).click();
    cy.getByCy(`delete-attributes-group-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`attributes-group-${updatedGroupName}-delete`).should('not.exist');

    // Shouldn't delete attributes group connected to the rubric
    cy.getByCy(`attributes-group-Общие характеристики-delete`).click();
    cy.getByCy(`delete-attributes-group-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`attributes-group-Общие характеристики-delete`).should('exist');
  });
});
