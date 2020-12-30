import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import clearTestData from '../../../utils/testUtils/clearTestData';
import {
  createTestAttributes,
  CreateTestAttributesPayloadInterface,
} from '../../../utils/testUtils/createTestAttributes';
import {
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_LANG,
} from '@yagu/shared';
import { fakerRu } from '../../../utils/testUtils/fakerLocales';

interface AddAttributeToGroupMutationInterface {
  groupId: string;
  name?: string;
  variant?: string;
}

const addAttributeToGroupMutation = ({
  groupId,
  name = fakerRu.commerce.productMaterial(),
  variant = ATTRIBUTE_VARIANT_STRING,
}: AddAttributeToGroupMutationInterface) => {
  return {
    mutation: gql`
      mutation AddAttributeToGroup($input: AddAttributeToGroupInput!) {
        addAttributeToGroup(input: $input) {
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
              optionsGroup {
                id
                nameString
              }
            }
          }
        }
      }
    `,
    options: {
      variables: {
        input: {
          groupId,
          variant,
          name: [{ key: DEFAULT_LANG, value: name }],
          positioningInTitle: [{ key: DEFAULT_LANG, value: ATTRIBUTE_POSITION_IN_TITLE_BEGIN }],
        },
      },
    },
  };
};

describe('Attributes Groups', () => {
  let mockData: CreateTestAttributesPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestAttributes();
  });

  afterEach(async () => {
    await clearTestData();
  });
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
          attributes {
            id
            nameString
          }
        }
      }
    `);
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
            name: [{ key: DEFAULT_LANG, value: 'f' }],
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
            name: mockData.attributesGroupWineFeaturesName,
          },
        },
      },
    );
    expect(createDuplicateAttributesGroupSuccess).toBeFalsy();

    // Should create attributes group.
    const newAttributesGroupName = fakerRu.commerce.department();
    const newAttributesGroupTranslation = [{ key: DEFAULT_LANG, value: newAttributesGroupName }];
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
            name: newAttributesGroupTranslation,
          },
        },
      },
    );
    expect(createAttributesGroup.success).toBeTruthy();
    expect(createAttributesGroup.group.nameString).toEqual(newAttributesGroupName);

    // Should update attributes group.
    const updatedAttributesGroupName = fakerRu.commerce.department();
    const updatedAttributesGroupTranslation = [
      { key: DEFAULT_LANG, value: updatedAttributesGroupName },
    ];
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
            name: updatedAttributesGroupTranslation,
          },
        },
      },
    );
    expect(updateAttributesGroup.success).toBeTruthy();
    expect(updateAttributesGroup.group.id).toEqual(createAttributesGroup.group.id);
    expect(updateAttributesGroup.group.nameString).toEqual(updatedAttributesGroupName);

    // Shouldn't create attribute and return validation error.
    const addAttributeToGroupErrorsArgs = addAttributeToGroupMutation({
      groupId: group.id,
      name: fakerRu.random.alpha(),
    });
    const { errors: addAttributeToGroupErrors } = await mutate<any>(
      addAttributeToGroupErrorsArgs.mutation,
      addAttributeToGroupErrorsArgs.options,
    );
    expect(addAttributeToGroupErrors).toBeDefined();

    // Should create attribute and add it to the group.
    const newAttributeName = fakerRu.commerce.productMaterial();
    const addAttributeToGroupMutationArgs = addAttributeToGroupMutation({
      groupId: group.id,
      name: newAttributeName,
    });
    const {
      data: { addAttributeToGroup },
    } = await mutate<any>(
      addAttributeToGroupMutationArgs.mutation,
      addAttributeToGroupMutationArgs.options,
    );
    const addedAttribute = addAttributeToGroup.group.attributes.find((attribute: any) => {
      return attribute.nameString === newAttributeName;
    });

    const newAttributesLength = group.attributes.length + 1;
    expect(addAttributeToGroup.success).toBeTruthy();
    expect(addAttributeToGroup.group.attributes).toHaveLength(newAttributesLength);
    expect(addedAttribute).toBeDefined();

    // Should update attribute in the group.
    const newName = fakerRu.commerce.productMaterial();
    const newPositioningInTitle = [{ key: DEFAULT_LANG, value: ATTRIBUTE_POSITION_IN_TITLE_BEGIN }];
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
            name: [{ key: DEFAULT_LANG, value: newName }],
            variant: addedAttribute.variant,
            positioningInTitle: newPositioningInTitle,
          },
        },
      },
    );
    const updatedAttribute = updatedGroup.attributes.find(
      ({ id }: { id: string }) => id === addedAttribute.id,
    );
    expect(updateAttributeInGroup.success).toBeTruthy();
    expect(updatedAttribute.nameString).toEqual(newName);
    expect(updatedAttribute.positioningInTitle).toEqual(newPositioningInTitle);

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
    expect(groupAfterAttributeDelete.attributes.length).toEqual(newAttributesLength - 1);

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
