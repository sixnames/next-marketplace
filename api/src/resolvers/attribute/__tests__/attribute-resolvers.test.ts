import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { stringAttribute } from '../__fixtures__';
import { AttributeModel } from '../../../entities/Attribute';

describe('Attributes', () => {
  it('Should return current attribute', async () => {
    const { query } = await authenticatedTestClient();
    const attribute = await AttributeModel.create(stringAttribute);

    const { data } = await query(`
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
