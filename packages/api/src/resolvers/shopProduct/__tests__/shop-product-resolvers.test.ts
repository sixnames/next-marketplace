import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
// import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
// import { gql } from 'apollo-server-express';

describe('Shop product', () => {
  let mockData: CreateTestDataPayloadInterface;

  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD shop products', async () => {
    console.log(mockData);
    // const { query, mutate } = await authenticatedTestClient();
    // Shouldn't add product to the shop on duplicate error
    // const addProductToShopDuplicatePayload = await mutate<any>(
    //   gql`
    //     mutation AddProductToShop($input: AddProductToShopInput!) {
    //       addProductToShop(input: $input) {
    //         success
    //         message
    //         shop {
    //           id
    //         }
    //       }
    //     }
    //   `,
    //   {
    //     variables: {
    //       input: {
    //         shopId: currentShop.id,
    //         productId: mockData.productF.id,
    //         available: 0,
    //         price: 1,
    //       },
    //     },
    //   },
    // );
    // expect(addProductToShopDuplicatePayload.data.addProductToShop.success).toBeFalsy();
  });
});
