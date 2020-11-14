import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';

describe('Shop product', () => {
  let mockData: CreateTestDataPayloadInterface;

  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD shop products', async () => {
    const { shopAProductA } = mockData;
    const oldPrice = shopAProductA.price;

    const { mutate } = await authenticatedTestClient();

    // Should update shop product
    const updateShopProductPayload = await mutate<any>(
      gql`
        mutation UpdateShopProduct($input: UpdateShopProductInput!) {
          updateShopProduct(input: $input) {
            success
            message
            product {
              id
              available
              price
              oldPrices {
                price
                createdAt
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            productId: shopAProductA.id,
            available: 0,
            price: 1,
          },
        },
      },
    );
    const {
      data: { updateShopProduct },
    } = updateShopProductPayload;
    expect(updateShopProduct.success).toBeTruthy();
    expect(updateShopProduct.product.oldPrices[0].price).toEqual(oldPrice);
  });
});
