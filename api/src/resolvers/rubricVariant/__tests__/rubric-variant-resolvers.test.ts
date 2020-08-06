import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import { RubricVariant } from '../../../entities/RubricVariant';
import { MOCK_RUBRIC_VARIANT_ALCOHOL } from '../../../config';

describe('Rubric type', () => {
  it('Should CRUD rubric variant', async () => {
    const { mutate, query } = await testClientWithContext({});

    // Shouldn't create rubric types on validation error
    const {
      data: { createRubricVariant: createRubricVariantWithError },
    } = await mutate(
      `
      mutation CreateRubricVariant($input: CreateRubricVariantInput!){
        createRubricVariant(input: $input) {
          success
          message
          variant {
            id
            nameString
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: [{ key: 'ru', value: '' }],
          },
        },
      },
    );
    expect(createRubricVariantWithError.success).toBeFalsy();

    // Shouldn't create rubric types on duplicate error
    const {
      data: { createRubricVariant: createRubricVariantWithDuplicateError },
    } = await mutate(
      `
      mutation CreateRubricVariant($input: CreateRubricVariantInput!){
        createRubricVariant(input: $input) {
          success
          message
          variant {
            id
            nameString
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: [{ key: 'ru', value: MOCK_RUBRIC_VARIANT_ALCOHOL.name[0].value }],
          },
        },
      },
    );
    expect(createRubricVariantWithDuplicateError.success).toBeFalsy();

    // Should create rubric variant
    const newRubricVariantName = 'new';
    const {
      data: { createRubricVariant },
    } = await mutate(
      `
      mutation CreateRubricVariant($input: CreateRubricVariantInput!){
        createRubricVariant(input: $input) {
          success
          message
          variant {
            id
            nameString
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: [{ key: 'ru', value: newRubricVariantName }],
          },
        },
      },
    );
    expect(createRubricVariant.success).toBeTruthy();
    expect(createRubricVariant.variant.nameString).toEqual(newRubricVariantName);

    // Should return all rubric types
    const { data: allRubricVariants } = await query(`
      query {
        getAllRubricVariants {
          id
          nameString
        }
      }
    `);
    const allRubricVariantsList: RubricVariant[] = allRubricVariants.getAllRubricVariants;
    expect(allRubricVariantsList).toHaveLength(3);

    // Should return current rubric variant
    const currentRubricVariant = createRubricVariant.variant;
    const {
      data: { getRubricVariant },
    } = await query(
      `
      query GetRubricVariant($id: ID!){
        getRubricVariant(id: $id) {
          id
          nameString
        }
      }
    `,
      {
        variables: {
          id: currentRubricVariant.id,
        },
      },
    );
    expect(getRubricVariant.id).toEqual(currentRubricVariant.id);

    // Should update rubric variant
    const updatedRubricVariantName = 'newName';
    const {
      data: { updateRubricVariant },
    } = await mutate(
      `
      mutation UpdateRubricVariant($input: UpdateRubricVariantInput!){
        updateRubricVariant(input: $input) {
          success
          message
          variant {
            id
            nameString
          }
        }
      }
    `,
      {
        variables: {
          input: {
            id: currentRubricVariant.id,
            name: [{ key: 'ru', value: updatedRubricVariantName }],
          },
        },
      },
    );
    expect(updateRubricVariant.success).toBeTruthy();
    expect(updateRubricVariant.variant.nameString).toEqual(updatedRubricVariantName);

    // Should delete rubric variant
    const {
      data: { deleteRubricVariant },
    } = await mutate(
      `
      mutation DeleteRubricVariant($id: ID!){
        deleteRubricVariant(id: $id) {
          success
          message
        }
      }
    `,
      {
        variables: {
          id: currentRubricVariant.id,
        },
      },
    );
    expect(deleteRubricVariant.success).toBeTruthy();
  });
});
