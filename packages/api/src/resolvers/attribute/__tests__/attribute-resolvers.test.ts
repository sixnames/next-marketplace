import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { stringAttribute } from '../__fixtures__';
import { AttributeModel } from '../../../entities/Attribute';
import { gql } from 'apollo-server-express';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';

describe('Attributes', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should return current attribute', async () => {
    const { query } = await authenticatedTestClient();
    const attribute = await AttributeModel.create(stringAttribute);

    const { data } = await query<any>(gql`
        query {
          getAttribute(id: "${attribute.id}") {
            id
            nameString
            variant
          }
        }
      `);

    expect(data.getAttribute.id).toEqual(attribute.id);
  });
});
