import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import getLangField from '../../../utils/translations/getLangField';
import { anotherOptionsGroup, optionForGroup, optionsGroup } from '../__fixtures__';
import { gql } from 'apollo-server-express';
import clearTestData from '../../../utils/testUtils/clearTestData';
import {
  createTestOptions,
  CreateTestOptionsInterface,
} from '../../../utils/testUtils/createTestOptions';
import {
  DEFAULT_LANG,
  GENDER_IT,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ENUMS,
  OPTIONS_GROUP_VARIANT_ICON,
} from '@yagu/shared';

const addOptionToGroupMutation = gql`
  mutation AddOptionToGroup($input: AddOptionToGroupInput!) {
    addOptionToGroup(input: $input) {
      success
      message
      group {
        id
        nameString
        options {
          id
          nameString
          color
          gender
          variants {
            key
            value {
              key
              value
            }
          }
        }
      }
    }
  }
`;

const updateOptionInGroupMutation = gql`
  mutation UpdateOptionToGroup($input: UpdateOptionInGroupInput!) {
    updateOptionInGroup(input: $input) {
      message
      success
      group {
        id
        nameString
        options {
          id
          nameString
          color
          gender
          variants {
            key
            value {
              key
              value
            }
          }
        }
      }
    }
  }
`;

describe('Options groups', () => {
  let mockData: CreateTestOptionsInterface;
  beforeEach(async () => {
    mockData = await createTestOptions();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD options group', async () => {
    const { query, mutate } = await authenticatedTestClient();

    // Should return all options groups
    const {
      data: { getAllOptionsGroups },
    } = await query<any>(gql`
      {
        getAllOptionsGroups {
          id
          nameString
        }
      }
    `);

    const colorsGroupName = getLangField(mockData.optionsGroupColors.name, DEFAULT_LANG);
    const group = getAllOptionsGroups.find(({ nameString }: any) => nameString === colorsGroupName);
    expect(getAllOptionsGroups).not.toBeNull();

    // Should return current options group
    const {
      data: { getOptionsGroup },
    } = await query<any>(
      gql`
        query GetOptionsGroup($id: ID!) {
          getOptionsGroup(id: $id) {
            id
          }
        }
      `,
      {
        variables: {
          id: group.id,
        },
      },
    );
    expect(getOptionsGroup.id).toEqual(group.id);

    // Shouldn't create options group on validation error
    const { errors: createOptionsGroupFailSuccess } = await mutate<any>(
      gql`
        mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
          createOptionsGroup(input: $input) {
            success
            group {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: [{ key: DEFAULT_LANG, value: 'f' }],
          },
        },
      },
    );
    expect(createOptionsGroupFailSuccess).toBeDefined();

    // Should return duplicate options group error on group create
    const {
      data: { createOptionsGroup: duplicate },
    } = await mutate<any>(
      gql`
        mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
          createOptionsGroup(input: $input) {
            success
            message
            group {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: [
              {
                key: DEFAULT_LANG,
                value: colorsGroupName,
              },
            ],
          },
        },
      },
    );
    expect(duplicate.success).toBeFalsy();

    // Should create options group
    const {
      data: { createOptionsGroup },
    } = await mutate<any>(
      gql`
        mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
          createOptionsGroup(input: $input) {
            success
            group {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: [{ key: DEFAULT_LANG, value: optionsGroup.name }],
            variant: OPTIONS_GROUP_VARIANT_ICON,
          },
        },
      },
    );

    const createdGroup = createOptionsGroup.group;
    expect(createOptionsGroup.success).toBeTruthy();
    expect(createdGroup.nameString).toEqual(optionsGroup.name);

    // Shouldn't update options group if new name is not valid
    const { errors: updateOptionsGroupFailSuccess } = await mutate<any>(
      gql`
        mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
          updateOptionsGroup(input: $input) {
            success
            message
            group {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: createdGroup.id,
            name: [{ key: DEFAULT_LANG, value: 'f' }],
          },
        },
      },
    );
    expect(updateOptionsGroupFailSuccess).toBeDefined();

    // Should return duplicate options group error on group update
    const {
      data: { updateOptionsGroup: duplicateOnUpdate },
    } = await mutate<any>(
      gql`
        mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
          updateOptionsGroup(input: $input) {
            success
            group {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: createdGroup.id,
            name: [{ key: DEFAULT_LANG, value: group.nameString }],
          },
        },
      },
    );
    expect(duplicateOnUpdate.success).toBeFalsy();

    // Should return options group variants list
    const {
      data: { getOptionsGroupVariantsOptions },
    } = await query<any>(gql`
      query {
        getOptionsGroupVariantsOptions {
          id
          nameString
        }
      }
    `);
    expect(getOptionsGroupVariantsOptions).toHaveLength(OPTIONS_GROUP_VARIANT_ENUMS.length);

    // Should update options group
    const {
      data: { updateOptionsGroup },
    } = await mutate<any>(
      gql`
        mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
          updateOptionsGroup(input: $input) {
            success
            message
            group {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: createdGroup.id,
            name: [{ key: DEFAULT_LANG, value: anotherOptionsGroup.name }],
            variant: OPTIONS_GROUP_VARIANT_COLOR,
          },
        },
      },
    );
    const updatedGroup = updateOptionsGroup.group;
    expect(updateOptionsGroup.success).toBeTruthy();
    expect(updatedGroup.nameString).toEqual(anotherOptionsGroup.name);

    // Shouldn't create option on color validation error
    const {
      data: { addOptionToGroup: addOptionToGroupColorValidationError },
    } = await mutate<any>(addOptionToGroupMutation, {
      variables: {
        input: {
          groupId: updatedGroup.id,
          name: [
            {
              key: DEFAULT_LANG,
              value: optionForGroup.name,
            },
          ],
          color: null,
          gender: GENDER_IT,
        },
      },
    });
    expect(addOptionToGroupColorValidationError.success).toBeFalsy();

    // Should delete options group
    const { data } = await mutate<any>(
      gql`
        mutation DeleteOptionsGroup($id: ID!) {
          deleteOptionsGroup(id: $id) {
            success
          }
        }
      `,
      {
        variables: {
          id: updatedGroup.id,
        },
      },
    );
    expect(data.deleteOptionsGroup.success).toBeTruthy();

    // Shouldn't create option on validation error
    const { errors: addOptionToGroupValidationFail } = await mutate<any>(addOptionToGroupMutation, {
      variables: {
        input: {
          groupId: group.id,
          name: [{ key: DEFAULT_LANG, value: '' }],
          color: null,
          gender: GENDER_IT,
        },
      },
    });
    expect(addOptionToGroupValidationFail).toBeDefined();

    // Should return duplicate options group error on option update
    const { data: optionDuplicate } = await mutate<any>(addOptionToGroupMutation, {
      variables: {
        input: {
          groupId: group.id,
          name: [
            {
              key: DEFAULT_LANG,
              value: colorsGroupName,
            },
          ],
          gender: GENDER_IT,
        },
      },
    });
    expect(optionDuplicate.addOptionToGroup.success).toBeFalsy();

    // Should create option and add it to the options group
    const {
      data: { addOptionToGroup },
    } = await mutate<any>(addOptionToGroupMutation, {
      variables: {
        input: {
          groupId: group.id,
          name: [
            {
              key: DEFAULT_LANG,
              value: optionForGroup.name,
            },
          ],
          color: optionForGroup.color,
          variants: [
            {
              key: GENDER_IT,
              value: [
                {
                  key: DEFAULT_LANG,
                  value: optionForGroup.name,
                },
              ],
            },
          ],
        },
      },
    });
    expect(addOptionToGroup.success).toBeTruthy();
    const addedOption = addOptionToGroup.group.options[0];

    // Should return validation error on option update
    const { errors: updateOptionInGroupFalseSuccess } = await mutate<any>(
      updateOptionInGroupMutation,
      {
        variables: {
          input: {
            groupId: group.id,
            optionId: addedOption.id,
            name: [
              {
                key: DEFAULT_LANG,
                value: 'f',
              },
            ],
            color: 'b',
            gender: GENDER_IT,
          },
        },
      },
    );
    expect(updateOptionInGroupFalseSuccess).toBeDefined();

    // Should update option in options group
    const newOptionName = 'newOptionName';
    const newOptionColor = '898989';
    const {
      data: {
        updateOptionInGroup: {
          group: { options: updatedOptions },
          success: updateOptionInGroupSuccess,
        },
      },
    } = await mutate<any>(updateOptionInGroupMutation, {
      variables: {
        input: {
          groupId: group.id,
          optionId: addedOption.id,
          name: [
            {
              key: DEFAULT_LANG,
              value: newOptionName,
            },
          ],
          variants: [
            {
              key: GENDER_IT,
              value: [
                {
                  key: DEFAULT_LANG,
                  value: newOptionName,
                },
              ],
            },
          ],
          color: newOptionColor,
          gender: GENDER_IT,
        },
      },
    });

    const updatedOption = updatedOptions.find(({ id }: { id: string }) => id === addedOption.id);
    expect(updateOptionInGroupSuccess).toBeTruthy();
    expect(updatedOption.nameString).toEqual(newOptionName);
    expect(updatedOption.variants[0].value[0].value).toEqual(newOptionName);
    expect(updatedOption.gender).toEqual(GENDER_IT);
    expect(updatedOption.color).toEqual(newOptionColor);

    // Should delete option from options group
    const {
      data: { deleteOptionFromGroup },
    } = await mutate<any>(gql`
        mutation {
          deleteOptionFromGroup(
            input: {
              groupId: "${group.id}"
              optionId: "${updatedOption.id}"
            }
          ) {
            success
            group {
              options {
                id
                nameString
                color
              }
            }
          }
        }
      `);

    expect(deleteOptionFromGroup.success).toBeTruthy();
    expect(deleteOptionFromGroup.group.options.length).toEqual(3);
  });
});
