import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_OPTIONS,
  MOCK_OPTIONS_GROUP,
  MOCK_OPTIONS_GROUP_FOR_DELETE,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';

const mockGroupName = MOCK_OPTIONS_GROUP.name[0].value;
const mockOptionName = MOCK_OPTIONS[0].name[0].value;
const mockOptionColor = MOCK_OPTIONS[0].color;
const mockGroupForDeleteName = MOCK_OPTIONS_GROUP_FOR_DELETE.name[0].value;
const createdGroupName = 'cy-test-new-group';
const groupNewName = 'cy-test-updated-name';
const optionFakeName = 'f';
const optionFakeColor = 'b';
const optionName = 'cy-test-option';
const optionColor = '333333';
const optionNewName = 'cy-test-new-option-name';
const optionNewColor = 'fafafa';

describe('Options Groups', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
        GetAllOptionsGroups: {
          getAllOptionsGroups: [
            {
              id: '1',
              nameString: mockGroupName,
              options: [
                {
                  id: '11',
                },
              ],
            },
            {
              id: '2',
              nameString: mockGroupForDeleteName,
              options: [
                {
                  id: '22',
                },
              ],
            },
          ],
        },
        GetOptionsGroup: {
          getOptionsGroup: {
            id: '1',
            nameString: mockGroupName,
            options: [
              {
                id: '11',
                nameString: mockOptionName,
                color: mockOptionColor,
              },
            ],
          },
        },
        CreateOptionsGroup: {
          createOptionsGroup: {
            success: true,
            message: 'success',
            group: {
              id: '33',
              nameString: createdGroupName,
              options: [],
            },
          },
        },
        UpdateOptionsGroup: {
          updateOptionsGroup: {
            success: true,
            message: 'success',
            group: {
              id: '1',
              nameString: groupNewName,
              options: [
                {
                  id: '11',
                  nameString: mockOptionName,
                  color: mockOptionColor,
                },
              ],
            },
          },
        },
        DeleteOptionsGroup: {
          deleteOptionsGroup: {
            success: true,
            message: 'success',
          },
        },
        AddOptionToGroup: {
          addOptionToGroup: {
            success: true,
            message: 'success',
            group: {
              id: '1',
              nameString: mockGroupName,
              options: [
                {
                  id: '111',
                  nameString: optionName,
                  color: optionColor,
                },
              ],
            },
          },
        },
        UpdateOptionInGroup: {
          updateOptionInGroup: {
            success: true,
            message: 'success',
            group: {
              id: '1',
              nameString: mockGroupName,
              options: [
                {
                  id: '111',
                  nameString: optionNewName,
                  color: optionNewColor,
                },
              ],
            },
          },
        },
        DeleteOptionFromGroup: {
          deleteOptionFromGroup: {
            success: true,
            message: 'success',
            group: {
              id: '1',
              nameString: mockGroupName,
              options: [],
            },
          },
        },
      },
    });
    cy.visit(`/options-groups${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  it('Should CRUD options group', () => {
    cy.getByCy(`create-options-group`).click();
    cy.getByCy(`create-options-group-modal`).should('exist');

    cy.getByCy(`update-name-input`).type(createdGroupName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`create-options-group-modal`).should('not.exist');

    cy.getByCy(`group-${createdGroupName}`).should('exist');

    // Should update group title on groups filter click
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`group-title`).contains(mockGroupName).should('exist');

    // Should update options group
    cy.getByCy(`options-group-update`).click();
    cy.getByCy(`update-name-input`).should('have.value', mockGroupName).clear().type(groupNewName);
    cy.getByCy(`update-name-submit`).click();
    // cy.contains(groupNewName).should('exist');

    // Should delete options group
    cy.getByCy(`options-group-delete`).click();
    cy.getByCy(`delete-options-group`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(groupNewName).should('not.exist');
    cy.getByCy(`group-${groupNewName}`).should('not.exist');
  });

  it.only(`Should CRUD option in group and show validation error`, () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-create`).click();

    // Validation error
    cy.getByCy(`option-name`).type(optionFakeName);
    cy.getByCy(`option-color`).type(optionFakeColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`name[0].value-error`).should('exist');
    cy.getByCy(`color-error`).should('exist');

    // Should create option in group
    cy.getByCy(`option-name`).clear().type(optionName);
    cy.getByCy(`option-color`).clear().type(optionColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionName}`).should('exist');

    // Should update option in group
    cy.getByCy(`${optionName}-option-update`).click();
    cy.getByCy(`option-name`).should('have.value', optionName).clear().type(optionNewName);
    cy.getByCy(`option-color`).should('have.value', optionColor).clear().type(optionNewColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${mockOptionName}`).should('not.exist');
    cy.getByCy(`${optionNewName}`).should('exist');

    // Should delete option from group
    cy.getByCy(`${optionNewName}-option-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${optionNewName}`).should('not.exist');
  });
});
