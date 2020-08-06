import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import getLangField from '../../../utils/translations/getLangField';
import {
  DEFAULT_LANG,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_GROUP_COLORS,
  GENDER_IT,
} from '../../../config';
import { anotherOptionsGroup, optionForGroup, optionsGroup } from '../__fixtures__';

const addOptionToGroupMutation = () => `
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

const updateOptionInGroupMutation = () => `
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
  it('Should CRUD options group', async () => {
    const { query, mutate } = await authenticatedTestClient();

    // Should return all options groups
    const {
      data: { getAllOptionsGroups },
    } = await query(`
        {
          getAllOptionsGroups {
            id
            nameString
          }
        }
      `);

    const colorsGroupName = getLangField(MOCK_OPTIONS_GROUP_COLORS.name, DEFAULT_LANG);
    const group = getAllOptionsGroups.find(({ nameString }: any) => nameString === colorsGroupName);
    expect(getAllOptionsGroups).not.toBeNull();

    // Should return current options group
    const {
      data: { getOptionsGroup },
    } = await query(`
        {
          getOptionsGroup(id: "${group.id}") {
            id
          }
        }
      `);
    expect(getOptionsGroup.id).toEqual(group.id);

    // Shouldn't create options group on validation error
    const {
      data: {
        createOptionsGroup: { success: createOptionsGroupFailSuccess },
      },
    } = await mutate(`
        mutation {
          createOptionsGroup(
            input: {
              name: [{key: "${DEFAULT_LANG}", value: "f"}]
            }
          ) {
            success
            group {
              id
              nameString
            }
          }
        }
      `);
    expect(createOptionsGroupFailSuccess).toBeFalsy();

    // Should return duplicate options group error on group create
    const {
      data: { createOptionsGroup: duplicate },
    } = await mutate(`
        mutation {
          createOptionsGroup(
            input: {
              name: [{key: "ru", value: "${getLangField(
                MOCK_OPTIONS_GROUP_COLORS.name,
                DEFAULT_LANG,
              )}"}]
            }
          ) {
            success
            message
            group {
              id
              nameString
            }
          }
        }
      `);
    expect(duplicate.success).toBeFalsy();

    // Should create options group
    const {
      data: { createOptionsGroup },
    } = await mutate(`
        mutation {
          createOptionsGroup(
            input: {
              name: [{key: "ru", value: "${optionsGroup.name}"}]
            }
          ) {
            success
            group {
              id
              nameString
            }
          }
        }
      `);

    const createdGroup = createOptionsGroup.group;
    expect(createOptionsGroup.success).toBeTruthy();
    expect(createdGroup.nameString).toEqual(optionsGroup.name);

    // Shouldn't update options group if new name is not valid
    const {
      data: {
        updateOptionsGroup: { success: updateOptionsGroupFailSuccess },
      },
    } = await mutate(`
        mutation {
          updateOptionsGroup(
            input: {
              id: "${createdGroup.id}"
              name: [{key: "ru", value: "f"}]
            }
          ) {
            success
            message
            group {
              id
              nameString
            }
          }
        }
      `);
    expect(updateOptionsGroupFailSuccess).toBeFalsy();

    // Should return duplicate options group error on group update
    const {
      data: { updateOptionsGroup: duplicateOnUpdate },
    } = await mutate(`
        mutation {
          updateOptionsGroup(
            input: {
              id: "${createdGroup.id}"
              name: [{key: "ru", value: "${group.nameString}"}]
            }
          ) {
            success
            group {
              id
              nameString
            }
          }
        }
      `);
    expect(duplicateOnUpdate.success).toBeFalsy();

    // Should update options group
    const {
      data: { updateOptionsGroup },
    } = await mutate(`
        mutation {
          updateOptionsGroup(
            input: {
              id: "${createdGroup.id}"
              name: [{key: "ru", value: "${anotherOptionsGroup.name}"}]
            }
          ) {
            success
            message
            group {
              id
              nameString
            }
          }
        }
      `);
    const updatedGroup = updateOptionsGroup.group;
    expect(updateOptionsGroup.success).toBeTruthy();
    expect(updatedGroup.nameString).toEqual(anotherOptionsGroup.name);

    // Should delete options group
    const { data } = await mutate(`
        mutation {
          deleteOptionsGroup(id: "${updatedGroup.id}") {
            success
          }
        }
      `);
    expect(data.deleteOptionsGroup.success).toBeTruthy();

    // Shouldn't create option on validation error
    const {
      data: {
        addOptionToGroup: { success: addOptionToGroupValidationFail },
      },
    } = await mutate(addOptionToGroupMutation(), {
      variables: {
        input: {
          groupId: group.id,
          name: [{ key: DEFAULT_LANG, value: '' }],
          color: null,
          gender: GENDER_IT,
        },
      },
    });
    expect(addOptionToGroupValidationFail).toBeFalsy();

    // Should return duplicate options group error on option update
    const { data: optionDuplicate } = await mutate(addOptionToGroupMutation(), {
      variables: {
        input: {
          groupId: group.id,
          name: [
            {
              key: DEFAULT_LANG,
              value: getLangField(MOCK_OPTIONS_WINE_COLOR[0].name, DEFAULT_LANG),
            },
          ],
          color: MOCK_OPTIONS_WINE_COLOR[0].color,
          gender: GENDER_IT,
        },
      },
    });
    expect(optionDuplicate.addOptionToGroup.success).toBeFalsy();

    // Should create option and add it to the options group
    const {
      data: { addOptionToGroup },
    } = await mutate(addOptionToGroupMutation(), {
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
    const {
      data: {
        updateOptionInGroup: { success: updateOptionInGroupFalseSuccess },
      },
    } = await mutate(updateOptionInGroupMutation(), {
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
    });
    expect(updateOptionInGroupFalseSuccess).toBeFalsy();

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
    } = await mutate(updateOptionInGroupMutation(), {
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
    } = await mutate(`
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
