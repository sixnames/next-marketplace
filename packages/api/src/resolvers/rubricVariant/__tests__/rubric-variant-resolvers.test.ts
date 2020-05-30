import { getTestClientWithUser } from '../../../utils/test-data/testHelpers';
import { RubricVariant } from '../../../entities/RubricVariant';

describe('Rubric type', () => {
  it('Should CRUD rubric variant', async () => {
    const { mutate, query } = await getTestClientWithUser();

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
            name
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: '',
          },
        },
      },
    );
    expect(createRubricVariantWithError.success).toBeFalsy();

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
            name
          }
        }
      }
    `,
      {
        variables: {
          input: {
            name: newRubricVariantName,
          },
        },
      },
    );
    expect(createRubricVariant.success).toBeTruthy();
    expect(createRubricVariant.variant.name).toEqual(newRubricVariantName);

    // Should return all rubric types
    const { data: allRubricVariants } = await query(`
      query {
        getAllRubricVariants {
          id
          name
        }
      }
    `);
    const allMetricsList: RubricVariant[] = allRubricVariants.getAllRubricVariants;
    expect(allMetricsList).toHaveLength(3);

    // Should return current rubric variant
    const currentRubricVariant = createRubricVariant.variant;
    const {
      data: { getRubricVariant },
    } = await query(
      `
      query GetRubricVariant($id: ID!){
        getRubricVariant(id: $id) {
          id
          name
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
            name
          }
        }
      }
    `,
      {
        variables: {
          input: {
            id: currentRubricVariant.id,
            name: updatedRubricVariantName,
          },
        },
      },
    );
    expect(updateRubricVariant.success).toBeTruthy();
    expect(updateRubricVariant.variant.name).toEqual(updatedRubricVariantName);

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
