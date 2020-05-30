import { MOCK_OPTIONS_GROUP, MOCK_OPTIONS } from '@rg/config';
import { getTestClientWithAuthenticatedUser } from '../../../utils/test-data/testHelpers';
import { anotherOptionsGroup, optionForGroup, optionsGroup } from '../__fixtures__';

const addOptionToGroupMutation = (
  groupId: string,
  name = optionForGroup.name,
  color: string | null = optionForGroup.color,
) => `
        mutation {
          addOptionToGroup(
            input: {
              groupId: "${groupId}"
              name: "${name}",
              color: "${color}",
            }
          ) {
            success
            message
            group {
              id
              name
              options {
                id
                name
                color
              }
            }
          }
        }
      `;

const updateOptionInGroupMutation = (
  groupId: string,
  optionId: string,
  name: string,
  color: string | null,
) => `
        mutation {
          updateOptionInGroup(
            input: {
              groupId: "${groupId}"
              optionId: "${optionId}"
              name: "${name}"
              color: "${color}"
            }
          ) {
            message
            success
            group {
              options {
                id
                name
                color
              }
            }
          }
        }
      `;

describe('Options groups', () => {
  it('Should CRUD options group', async () => {
    const { query, mutate } = await getTestClientWithAuthenticatedUser();

    // Should return all options groups
    const {
      data: { getAllOptionsGroups },
    } = await query(`
        {
          getAllOptionsGroups {
            id
            name
          }
        }
      `);
    const group = getAllOptionsGroups[0];
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
              name: "f"
            }
          ) {
            success
            group {
              id
              name
            }
          }
        }
      `);

    expect(createOptionsGroupFailSuccess).toBeDefined();

    // Should return duplicate options group error on group create
    const {
      data: { createOptionsGroup: duplicate },
    } = await mutate(`
        mutation {
          createOptionsGroup(
            input: {
              name: "${MOCK_OPTIONS_GROUP.name}"
            }
          ) {
            success
            group {
              id
              name
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
              name: "${optionsGroup.name}"
            }
          ) {
            success
            group {
              id
              name
            }
          }
        }
      `);

    const createdGroup = createOptionsGroup.group;
    expect(createOptionsGroup.success).toBeTruthy();
    expect(createdGroup.name).toEqual(optionsGroup.name);

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
              name: "f"
            }
          ) {
            success
            message
            group {
              id
              name
            }
          }
        }
      `);
    expect(updateOptionsGroupFailSuccess).toBeFalsy();

    // Should return duplicate options group error on group update
    const { data: duplicateOnUpdate } = await mutate(`
        mutation {
          updateOptionsGroup(
            input: {
              id: "${createdGroup.id}"
              name: "${group.name}"
            }
          ) {
            success
            group {
              name
            }
          }
        }
      `);
    expect(duplicateOnUpdate.updateOptionsGroup.success).toBeFalsy();

    // Should update options group
    const {
      data: { updateOptionsGroup },
    } = await mutate(`
        mutation {
          updateOptionsGroup(
            input: {
              id: "${createdGroup.id}"
              name: "${anotherOptionsGroup.name}"
            }
          ) {
            success
            message
            group {
              id
              name
            }
          }
        }
      `);

    const updatedGroup = updateOptionsGroup.group;
    expect(updateOptionsGroup.success).toBeTruthy();
    expect(updatedGroup.name).toEqual(anotherOptionsGroup.name);

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
    } = await mutate(addOptionToGroupMutation(group.id, '', null));
    expect(addOptionToGroupValidationFail).toBeFalsy();

    // Should return duplicate options group error on option update
    const { data: optionDuplicate } = await mutate(
      addOptionToGroupMutation(group.id, MOCK_OPTIONS[0].name, MOCK_OPTIONS[0].color),
    );
    expect(optionDuplicate.addOptionToGroup.success).toBeFalsy();

    // Should create option and add it to the options group
    const {
      data: { addOptionToGroup },
    } = await mutate(addOptionToGroupMutation(group.id));

    expect(addOptionToGroup.success).toBeTruthy();
    const addedOption = addOptionToGroup.group.options[0];

    // Should return validation error on option update
    const {
      data: {
        updateOptionInGroup: { success: updateOptionInGroupFalseSuccess },
      },
    } = await mutate(updateOptionInGroupMutation(group.id, addedOption.id, 'f', 'b'));
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
    } = await mutate(
      updateOptionInGroupMutation(group.id, addedOption.id, newOptionName, newOptionColor),
    );

    const updatedOption = updatedOptions.find(({ id }: { id: string }) => id === addedOption.id);
    expect(updateOptionInGroupSuccess).toBeTruthy();
    expect(updatedOption.name).toEqual(newOptionName);
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
                name
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
