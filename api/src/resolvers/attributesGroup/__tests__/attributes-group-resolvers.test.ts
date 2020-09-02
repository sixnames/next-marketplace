import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { attributesGroup, anotherAttributesGroup, attributeForGroup } from '../__fixtures__';
import {
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
} from '../../../config';
import { gql } from 'apollo-server-express';

const addAttributeToGroupMutation = (
  groupId: string,
  name = attributeForGroup.name[0].value,
  variant = attributeForGroup.variant,
) => {
  return gql`
        mutation {
          addAttributeToGroup (
            input: {
              groupId: "${groupId}"
              name: [{key: "ru", value: "${name}"}]
              variant: ${variant}
              positioningInTitle: [{key: "ru", value: ${ATTRIBUTE_POSITION_IN_TITLE_BEGIN}}]
            }
          ) {
            success
            message
            group {
              id
              nameString
              attributes {
                id
                nameString
                variant
                positioningInTitle {
                 key
                 value
                }
                options {
                  id
                  nameString
                }
              }
            }
          }
        }
      `;
};

describe('Attributes Groups', () => {
  it('Should CRUD attributes groups.', async () => {
    const { query, mutate } = await authenticatedTestClient();

    // Should return all attributes groups
    const {
      data: { getAllAttributesGroups },
    } = await query<any>(gql`
      query {
        getAllAttributesGroups {
          id
          nameString
        }
      }
    `);
    expect(getAllAttributesGroups.length).toEqual(3);
    const group = getAllAttributesGroups[0];

    // Should return current attributes group.
    const {
      data: { getAttributesGroup },
    } = await query<any>(gql`
      query {
        getAttributesGroup(id: "${group.id}") {
          id
          nameString
        }
      }
    `);
    expect(getAttributesGroup.nameString).toEqual(group.nameString);

    // Shouldn't create attributes group on validation error.
    const { errors: createAttributesErrors } = await mutate<any>(
      gql`
        mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
          createAttributesGroup(input: $input) {
            success
            group {
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: [{ key: 'ru', value: 'f' }],
          },
        },
      },
    );
    expect(createAttributesErrors).toBeDefined();

    // Shouldn't create attributes group on duplicate error.
    const {
      data: {
        createAttributesGroup: { success: createDuplicateAttributesGroupSuccess },
      },
    } = await mutate<any>(
      gql`
        mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
          createAttributesGroup(input: $input) {
            success
            message
            group {
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: MOCK_ATTRIBUTES_GROUP_WINE_FEATURES.name,
          },
        },
      },
    );
    expect(createDuplicateAttributesGroupSuccess).toBeFalsy();

    // Should create attributes group.
    const {
      data: { createAttributesGroup },
    } = await mutate<any>(
      gql`
        mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
          createAttributesGroup(input: $input) {
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
            name: attributesGroup.name,
          },
        },
      },
    );
    expect(createAttributesGroup.success).toBeTruthy();
    expect(createAttributesGroup.group.nameString).toEqual(attributesGroup.name[0].value);

    // Should update attributes group.
    const {
      data: { updateAttributesGroup },
    } = await mutate<any>(
      gql`
        mutation UpdateAttributesGroup($input: UpdateAttributesGroupInput!) {
          updateAttributesGroup(input: $input) {
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
            id: createAttributesGroup.group.id,
            name: anotherAttributesGroup.name,
          },
        },
      },
    );
    expect(updateAttributesGroup.success).toBeTruthy();
    expect(updateAttributesGroup.group.id).toEqual(createAttributesGroup.group.id);
    expect(updateAttributesGroup.group.nameString).toEqual(anotherAttributesGroup.name[0].value);

    // Shouldn't create attribute and return validation error.
    const { errors: addAttributeToGroupErrors } = await mutate<any>(
      addAttributeToGroupMutation(group.id, 'f'),
    );
    expect(addAttributeToGroupErrors).toBeDefined();

    // Should create attribute and add it to the group.
    const {
      data: {
        addAttributeToGroup: {
          group: { attributes },
          success,
        },
      },
    } = await mutate<any>(addAttributeToGroupMutation(group.id));
    const addedAttribute = attributes.find((attribute: any) => {
      return attribute.nameString === attributeForGroup.name[0].value;
    });

    expect(success).toBeTruthy();
    expect(attributes.length).toEqual(5);
    expect(addedAttribute).toBeDefined();
    expect(addedAttribute.variant).toEqual(attributeForGroup.variant);

    // Should update attribute in the group.
    const newName = 'attributes_group_name_new';
    const {
      data: {
        updateAttributeInGroup: { group: updatedGroup },
        updateAttributeInGroup,
      },
    } = await mutate<any>(
      gql`
        mutation UpdateAttributeInGroup($input: UpdateAttributeInGroupInput!) {
          updateAttributeInGroup(input: $input) {
            success
            message
            group {
              id
              attributes {
                id
                nameString
                positioningInTitle {
                  key
                  value
                }
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            groupId: group.id,
            attributeId: addedAttribute.id,
            name: [{ key: 'ru', value: newName }],
            variant: addedAttribute.variant,
            positioningInTitle: [{ key: 'ru', value: ATTRIBUTE_POSITION_IN_TITLE_BEGIN }],
          },
        },
      },
    );
    const updatedAttribute = updatedGroup.attributes.find(
      ({ id }: { id: string }) => id === addedAttribute.id,
    );
    expect(updateAttributeInGroup.success).toBeTruthy();
    expect(updatedAttribute.nameString).toEqual(newName);
    expect(updatedAttribute.positioningInTitle).toEqual([
      { key: 'ru', value: ATTRIBUTE_POSITION_IN_TITLE_BEGIN },
    ]);

    // Should delete attribute from the group.
    const {
      data: {
        deleteAttributeFromGroup: {
          group: groupAfterAttributeDelete,
          success: successAfterAttributeDelete,
        },
      },
    } = await mutate<any>(gql`
        mutation {
          deleteAttributeFromGroup (
            input: {
              groupId: "${group.id}"
              attributeId: "${updatedAttribute.id}"
            }
          ) {
            success
            group {
              id
              attributes {
                id
                nameString
              }
            }
          }
        }
      `);
    expect(successAfterAttributeDelete).toBeTruthy();
    expect(groupAfterAttributeDelete.attributes.length).toEqual(4);

    // Should delete attributes group.
    const {
      data: { deleteAttributesGroup },
    } = await mutate<any>(gql`
        mutation {
          deleteAttributesGroup (
            id: "${group.id}"
          ) {
            success
          }
        }
      `);
    expect(deleteAttributesGroup.success).toBeTruthy();
  });
});
