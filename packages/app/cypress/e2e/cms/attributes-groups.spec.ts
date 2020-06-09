/// <reference types="cypress" />
import schema from '../../../src/generated/introspectionSchema.json';
import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
  ME_AS_ADMIN,
  MOCK_ATTRIBUTE_MULTIPLE,
  MOCK_ATTRIBUTES_GROUP,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_OPTIONS_GROUP,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';

const mockGroupName = MOCK_ATTRIBUTES_GROUP.name[0].value;
const mockAttributeName = MOCK_ATTRIBUTE_MULTIPLE.name[0].value;
const mockGroupForDeleteName = MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name[0].value;
const mockOptionsGroupName = MOCK_OPTIONS_GROUP.name[0].value;
const mockAttributeNewName = 'cy-test-new-attribute';
const createdGroupName = 'cy-test-new-group';
const updatedGroupName = 'cy-test-updated-group';
const updatedAttributeName = 'cy-test-updated-attribute';

describe('Attributes Groups', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
        GetAllAttributesGroups: {
          getAllAttributesGroups: [
            {
              id: '1',
              nameString: mockGroupName,
            },
            {
              id: '2',
              nameString: mockGroupForDeleteName,
            },
          ],
        },
        CreateAttributesGroup: {
          createAttributesGroup: {
            success: true,
            message: 'success',
            group: {
              id: '3',
              nameString: createdGroupName,
            },
          },
        },
        GetAttributesGroup: {
          getAttributesGroup: {
            id: '1',
            nameString: mockGroupName,
            attributes: [
              {
                id: '11',
                nameString: mockAttributeName,
                variant: ATTRIBUTE_TYPE_SELECT,
                options: {
                  id: '111',
                  nameString: mockOptionsGroupName,
                },
                metric: null,
              },
            ],
          },
        },
        GetNewAttributeOptions: {
          getAllOptionsGroups: [
            {
              id: 'options-group',
              nameString: 'options-group',
            },
          ],
          getAllMetrics: [
            {
              id: 'm',
              nameString: 'm',
            },
          ],
          getAttributeVariants: [
            {
              id: ATTRIBUTE_TYPE_MULTIPLE_SELECT,
              nameString: ATTRIBUTE_TYPE_MULTIPLE_SELECT,
            },
            {
              id: ATTRIBUTE_TYPE_STRING,
              nameString: ATTRIBUTE_TYPE_STRING,
            },
          ],
        },
        UpdateAttributesGroup: {
          updateAttributesGroup: {
            success: true,
            message: 'success',
            group: {
              id: '1',
              nameString: updatedGroupName,
            },
          },
        },
        DeleteAttributesGroup: {
          deleteAttributesGroup: {
            success: true,
            message: 'success',
          },
        },
        AddAttributeToGroup: {
          addAttributeToGroup: {
            success: true,
            message: 'success',
            group: {
              id: '1',
              nameString: mockGroupName,
              attributes: [
                {
                  id: '11',
                  nameString: mockAttributeName,
                  variant: ATTRIBUTE_TYPE_SELECT,
                  options: {
                    id: '111',
                    nameString: mockOptionsGroupName,
                  },
                  metric: null,
                },
                {
                  id: '8080',
                  nameString: mockAttributeNewName,
                  variant: ATTRIBUTE_TYPE_MULTIPLE_SELECT,
                  options: {
                    id: 'options-group',
                    nameString: 'options-group',
                  },
                  metric: {
                    id: 'm',
                    nameString: 'm',
                  },
                },
              ],
            },
          },
        },
        UpdateAttributeInGroup: {
          updateAttributeInGroup: {
            success: true,
            message: 'success',
            group: {
              id: '1',
              nameString: mockGroupName,
              attributes: [
                {
                  id: '11',
                  nameString: mockAttributeName,
                  variant: ATTRIBUTE_TYPE_SELECT,
                  options: {
                    id: '111',
                    nameString: mockOptionsGroupName,
                  },
                  metric: null,
                },
                {
                  id: '8080',
                  nameString: updatedAttributeName,
                  variant: ATTRIBUTE_TYPE_STRING,
                  options: null,
                  metric: {
                    id: 'm',
                    nameString: 'm',
                  },
                },
              ],
            },
          },
        },
        DeleteAttributeFromGroup: {
          deleteAttributeFromGroup: {
            success: true,
            message: 'success',
            group: {
              id: '1',
              nameString: mockGroupName,
              attributes: [
                {
                  id: '11',
                  nameString: mockAttributeName,
                  variant: ATTRIBUTE_TYPE_SELECT,
                  options: {
                    id: '111',
                    nameString: mockOptionsGroupName,
                  },
                  metric: null,
                },
              ],
            },
          },
        },
      },
    });

    cy.visit(`/attributes-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  it('Should CRUD attributes group', () => {
    // Should create a new attributes group
    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`create-attributes-group-modal`).should('exist');

    cy.getByCy(`update-name-input`).type(createdGroupName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`group-${createdGroupName}`).should('exist');

    // Should update group title on groups filter click
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`group-title`).contains(mockGroupName).should('exist');

    // Should update attributes group
    cy.getByCy(`attributes-group-update`).click();
    cy.getByCy(`update-name-input`)
      .should('have.value', mockGroupName)
      .clear()
      .type(updatedGroupName);
    cy.getByCy(`update-name-submit`).click();
    cy.contains(updatedGroupName).should('exist');

    // Should delete attributes group
    cy.getByCy(`attributes-group-delete`).click();
    cy.getByCy(`delete-attributes-group`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(updatedGroupName).should('not.exist');
    cy.getByCy(`group-${updatedGroupName}`).should('not.exist');
  });

  it(`Should CRUD attribute in group on validation error`, () => {
    // Shouldn't create attribute in group on validation error
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-create`).click();

    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`variant-error`).should('exist');

    cy.getByCy(`attribute-variant`).select('multipleSelect');
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`options-error`).should('exist');

    // Should create attribute in group
    cy.getByCy(`attribute-name`).clear().type(mockAttributeNewName);
    cy.getByCy(`attribute-options`).select('options-group');
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}`).should('exist');

    // Should update attribute in group
    cy.getByCy(`${mockAttributeNewName}-attribute-update`).click();

    cy.getByCy(`attribute-name`)
      .should('have.value', mockAttributeNewName)
      .clear()
      .type(updatedAttributeName);
    cy.getByCy(`attribute-variant`).select('string');
    cy.getByCy(`attribute-metrics`).select('m');
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}`).should('not.exist');
    cy.getByCy(`${updatedAttributeName}`).should('exist');

    // Should delete attribute from group
    cy.getByCy(`${updatedAttributeName}-attribute-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${updatedAttributeName}`).should('not.exist');
  });
});
