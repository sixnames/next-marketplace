import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient, mutateWithImages } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import { MOCK_COMPANY, MOCK_SHOPS, MOCK_SHOP } from '@yagu/mocks';
import { testProduct } from '../../product/__fixtures__';
import { generateTestProductAttributes } from '../../../utils/testUtils/generateTestProductAttributes';
import { RubricModel } from '../../../entities/Rubric';
import { RUBRIC_LEVEL_TWO } from '@yagu/config';
import { AttributesGroupModel } from '../../../entities/AttributesGroup';
import { AttributeModel } from '../../../entities/Attribute';
import { OptionsGroupModel } from '../../../entities/OptionsGroup';
import { OptionModel } from '../../../entities/Option';

describe('Shop', () => {
  beforeEach(async () => {
    await createTestData();
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
    );
    const currentShop = getAllShops.find(({ slug }: any) => slug === MOCK_SHOP.slug);
    if (!currentShop) {
      throw Error('Test shop not found');
    }
    expect(getAllShops).toHaveLength(MOCK_SHOPS.length);
    expect(currentShop.company.nameString).toEqual(MOCK_COMPANY.nameString);

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
    // create new product
    const rubricLevelTwo = await RubricModel.findOne({ level: RUBRIC_LEVEL_TWO }).populate({
      path: 'attributesGroups.node',
      model: AttributesGroupModel,
      populate: {
        path: 'attributes',
        model: AttributeModel,
        populate: {
          path: 'optionsGroup',
          model: OptionsGroupModel,
          populate: {
            path: 'options',
            model: OptionModel,
          },
        },
      },
    });
    if (!rubricLevelTwo) {
      throw Error('Test rubricLevelTwo not found');
    }
    const productAttributes = generateTestProductAttributes({ rubric: rubricLevelTwo });
    const {
      data: { createProduct },
    } = await mutateWithImages({
      mutation: gql`
        mutation CreateProduct($input: CreateProductInput!) {
          createProduct(input: $input) {
            success
            message
            product {
              id
            }
          }
        }
      `,
      input: (images) => {
        return {
          name: testProduct.name,
          cardName: testProduct.cardName,
          price: testProduct.price,
          description: testProduct.description,
          rubrics: [rubricLevelTwo.id],
          assets: images,
          ...productAttributes,
        };
      },
    });
    // add product to the shop
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
                totalDocs
                totalPages
                limit
                docs {
                  id
                  available
                  price
                  oldPrices
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
            productId: createProduct.product.id,
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
            productId: createProduct.product.id,
            available: 0,
            price: 1,
          },
        },
      },
    );
    expect(addProductToShopDuplicatePayload.data.addProductToShop.success).toBeFalsy();
  });
});
