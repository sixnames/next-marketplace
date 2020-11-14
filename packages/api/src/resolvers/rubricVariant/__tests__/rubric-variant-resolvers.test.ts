import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { RubricVariant } from '../../../entities/RubricVariant';
import { MOCK_RUBRIC_VARIANT_ALCOHOL } from '@yagu/mocks';
import { gql } from 'apollo-server-express';
import { DEFAULT_LANG } from '@yagu/config';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';

describe('Rubric variant', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD rubric variant', async () => {
    const { mutate, query } = await authenticatedTestClient();

    // Shouldn't create rubric types on validation error
    const { errors: createRubricVariantWithError } = await mutate<any>(
      gql`
        mutation CreateRubricVariant($input: CreateRubricVariantInput!) {
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
            name: [{ key: DEFAULT_LANG, value: '' }],
          },
        },
      },
    );
    expect(createRubricVariantWithError).toBeDefined();

    // Shouldn't create rubric types on duplicate error
    const {
      data: { createRubricVariant: createRubricVariantWithDuplicateError },
    } = await mutate<any>(
      gql`
        mutation CreateRubricVariant($input: CreateRubricVariantInput!) {
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
            name: [{ key: DEFAULT_LANG, value: MOCK_RUBRIC_VARIANT_ALCOHOL.name[0].value }],
          },
        },
      },
    );
    expect(createRubricVariantWithDuplicateError.success).toBeFalsy();

    // Should create rubric variant
    const newRubricVariantName = 'new';
    const {
      data: { createRubricVariant },
    } = await mutate<any>(
      gql`
        mutation CreateRubricVariant($input: CreateRubricVariantInput!) {
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
            name: [{ key: DEFAULT_LANG, value: newRubricVariantName }],
          },
        },
      },
    );
    expect(createRubricVariant.success).toBeTruthy();
    expect(createRubricVariant.variant.nameString).toEqual(newRubricVariantName);

    // Should return all rubric types
    const { data: allRubricVariants } = await query<any>(gql`
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
    } = await query<any>(
      gql`
        query GetRubricVariant($id: ID!) {
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
    } = await mutate<any>(
      gql`
        mutation UpdateRubricVariant($input: UpdateRubricVariantInput!) {
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
            name: [{ key: DEFAULT_LANG, value: updatedRubricVariantName }],
          },
        },
      },
    );
    expect(updateRubricVariant.success).toBeTruthy();
    expect(updateRubricVariant.variant.nameString).toEqual(updatedRubricVariantName);

    // Should delete rubric variant
    const {
      data: { deleteRubricVariant },
    } = await mutate<any>(
      gql`
        mutation DeleteRubricVariant($id: ID!) {
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
