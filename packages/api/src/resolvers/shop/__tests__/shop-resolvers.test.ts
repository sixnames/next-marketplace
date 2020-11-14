import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';

describe('Shop', () => {
  let mockData: CreateTestDataPayloadInterface;

  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD shops', async () => {
    const { query, mutate } = await authenticatedTestClient();

    // Should return shops list
    const {
      data: { getAllShops },
    } = await query<any>(
      gql`
        query GetAllShops {
          getAllShops {
            docs {
              id
              nameString
              slug
              company {
                id
                nameString
                slug
              }
            }
          }
        }
      `,
    );
    const currentShop = getAllShops.docs.find(({ slug }: any) => slug === mockData.shopA.slug);
    if (!currentShop) {
      throw Error('Test shop not found');
    }
    expect(getAllShops.docs).toHaveLength(mockData.mockShops.length);
    expect(currentShop.company.nameString).toEqual(mockData.companyA.nameString);

    // Should return shop by ID
    const {
      data: { getShop },
    } = await query<any>(
      gql`
        query GetShop($id: ID!) {
          getShop(id: $id) {
            id
            nameString
            slug
            company {
              id
              nameString
              slug
            }
          }
        }
      `,
      {
        variables: {
          id: currentShop.id,
        },
      },
    );
    expect(getShop.id).toEqual(currentShop.id);

    // Should add product to the shop
    const addProductToShopPayload = await mutate<any>(
      gql`
        mutation AddProductToShop($input: AddProductToShopInput!) {
          addProductToShop(input: $input) {
            success
            message
            shop {
              id
              nameString
              slug
              products {
                docs {
                  id
                  available
                  price
                  oldPrices {
                    price
                  }
                  shop {
                    id
                  }
                  product {
                    id
                    nameString
                  }
                }
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            shopId: currentShop.id,
            productId: mockData.productF.id,
            available: 10,
            price: 1000,
          },
        },
      },
    );
    const {
      data: { addProductToShop },
    } = addProductToShopPayload;
    expect(addProductToShop.success).toBeTruthy();
    expect(addProductToShop.shop.id).toEqual(currentShop.id);
    expect(addProductToShop.shop.products.docs).toHaveLength(mockData.shopA.products.length + 1);

    // Shouldn't add product to the shop on duplicate error
    const addProductToShopDuplicatePayload = await mutate<any>(
      gql`
        mutation AddProductToShop($input: AddProductToShopInput!) {
          addProductToShop(input: $input) {
            success
            message
            shop {
              id
            }
          }
        }
      `,
      {
        variables: {
          input: {
            shopId: currentShop.id,
            productId: mockData.productF.id,
            available: 0,
            price: 1,
          },
        },
      },
    );
    expect(addProductToShopDuplicatePayload.data.addProductToShop.success).toBeFalsy();

    // Should update shop product
    const deleteProductFromShopPayload = await mutate<any>(
      gql`
        mutation DeleteProductFromShop($input: DeleteProductFromShopInput!) {
          deleteProductFromShop(input: $input) {
            success
            message
            shop {
              id
              products {
                docs {
                  id
                }
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            shopId: currentShop.id,
            productId: mockData.shopAProductA.id,
          },
        },
      },
    );
    const {
      data: { deleteProductFromShop },
    } = deleteProductFromShopPayload;
    expect(deleteProductFromShop.success).toBeTruthy();
    expect(deleteProductFromShop.shop.products.docs).toHaveLength(mockData.shopA.products.length);
  });
});
