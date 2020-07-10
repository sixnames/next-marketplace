/// <reference types="cypress" />
import {
  QUERY_DATA_LAYOUT_FILTER_ENABLED,
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  MOCK_ATTRIBUTES_GROUP,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_OPTIONS_GROUP,
} from '../../../config';

const mockGroupName = MOCK_ATTRIBUTES_GROUP.name[0].value;
const mockGroupForDeleteName = MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name[0].value;
const mockOptionsGroupName = MOCK_OPTIONS_GROUP.name[0].value;
const mockAttributeNewName = 'new_attribute';
const createdGroupName = 'new_group';
const updatedGroupName = 'updated_group';
const updatedAttributeName = 'updated_attribute';
const fakeName = 'f';

describe('Attributes Groups', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.auth({ redirect: `/app/cms/attributes-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}` });
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD attributes group', () => {
    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`create-attributes-group-modal`).should('exist');

    // Should show validation error on not valid attributes group name
    cy.getByCy(`update-name-input`).type(fakeName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Should create a new attributes group
    cy.getByCy(`update-name-input`).clear().type(createdGroupName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`group-${createdGroupName}`).click();
    cy.getByCy(`group-title`).contains(createdGroupName).should('exist');

    // Should show validation error on not valid attributes group update
    cy.getByCy(`attributes-group-update`).click();
    cy.getByCy(`update-name-input`).should('have.value', createdGroupName).clear().type(fakeName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');

    // Should update attributes group
    cy.getByCy(`update-name-input`).clear().type(updatedGroupName);
    cy.getByCy(`update-name-submit`).click();
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

    // Should CRUD attribute in group
    // Shouldn't create attribute in group on validation error
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-create`).click();

    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`variant-error`).should('exist');

    cy.getByCy(`attribute-variant`).select(ATTRIBUTE_TYPE_MULTIPLE_SELECT);
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`options-error`).should('exist');

    // Should create attribute in group
    cy.getByCy(`attribute-variant`).select(ATTRIBUTE_TYPE_MULTIPLE_SELECT);
    cy.getByCy(`attribute-name`).type(mockAttributeNewName);
    cy.selectOptionByTestId(`attribute-options`, mockOptionsGroupName);
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}`).should('exist');

    // Should update attribute in group
    cy.getByCy(`${mockAttributeNewName}-attribute-update`).click();

    cy.getByCy(`attribute-name`)
      .should('have.value', mockAttributeNewName)
      .clear()
      .type(updatedAttributeName);
    cy.getByCy(`attribute-variant`).select('string');
    cy.selectNthOption(`[data-cy=attribute-metrics]`, 3);
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}`).should('not.exist');
    cy.getByCy(`${updatedAttributeName}`).should('exist');

    // Should delete attribute from group
    cy.getByCy(`${updatedAttributeName}-attribute-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${updatedAttributeName}`).should('not.exist');
  });
});
