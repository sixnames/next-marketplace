import {
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  DEFAULT_LOCALE,
  ROUTE_CMS,
  SECONDARY_LOCALE,
} from 'config/common';

describe('Attributes Groups', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/attributes`);
  });

  it('Should CRUD attributes group', () => {
    const createdGroupName = 'createdGroupName';
    const updatedGroupName = 'updatedGroupName';

    const attributeNewName = 'attributeNewName';
    const updatedAttributeName = 'updatedAttributeName';

    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`attributes-group-modal`).should('exist');

    // Should create a new attributes group
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(createdGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.wait(1500);

    // Should update attributes group
    cy.getByCy(`attributes-group-${createdGroupName}-update`).click();
    cy.getByCy(`sub-nav-details`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedGroupName);
    cy.getByCy(`attributes-group-submit`).click();
    cy.contains(updatedGroupName).should('exist');

    // Should CRUD attributes
    cy.getByCy(`sub-nav-attributes`).click();
    cy.wait(1500);
    cy.getByCy(`attributes-list`).should('exist');

    // Should create attribute in group
    cy.getByCy(`create-attribute`).click();
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(attributeNewName);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).type(attributeNewName);
    cy.getByCy(`attribute-variant`).select(ATTRIBUTE_VARIANT_SELECT);
    cy.getByCy(`attribute-viewVariant`).select(ATTRIBUTE_VIEW_VARIANT_LIST);
    cy.selectOptionByTestId(`attribute-options`, 'Год');
    cy.getByCy(`positioningInTitle-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`positioningInTitle-${DEFAULT_LOCALE}`).select(ATTRIBUTE_POSITION_IN_TITLE_BEGIN);
    cy.getByCy(`positioningInTitle-${SECONDARY_LOCALE}`).select(
      ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
    );
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${attributeNewName}-row`).should('exist');

    // Should update attribute in group
    cy.getByCy(`${attributeNewName}-attribute-update`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`)
      .should('have.value', attributeNewName)
      .clear()
      .type(updatedAttributeName);
    cy.getByCy(`attribute-variant`).select(ATTRIBUTE_VARIANT_SELECT);
    cy.selectNthOption(`[data-cy=attribute-metrics]`, 3);
    cy.getByCy(`positioningInTitle-${DEFAULT_LOCALE}`).select(ATTRIBUTE_POSITION_IN_TITLE_END);
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${attributeNewName}-row`).should('not.exist');
    cy.getByCy(`${updatedAttributeName}-row`).should('exist');

    // Should delete attribute from group
    cy.getByCy(`${updatedAttributeName}-attribute-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${attributeNewName}-row`).should('not.exist');

    // Should delete attributes group
    cy.visit(`${ROUTE_CMS}/attributes`);
    cy.getByCy(`attributes-group-${updatedGroupName}-delete`).click();
    cy.getByCy(`delete-attributes-group-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`attributes-group-${updatedGroupName}-delete`).should('not.exist');
  });
});
