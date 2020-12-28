import { mutateWithImages, authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { Upload } from '../../../types/upload';
import { generateTestProductAttributes } from '../../../utils/testUtils/generateTestProductAttributes';
import { gql } from 'apollo-server-express';
import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { ProductConnectionModel } from '../../../entities/ProductConnection';
import { DEFAULT_LANG, SECONDARY_LANG, SORT_ASC } from '@yagu/shared';
import * as faker from 'faker';

describe('Product', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD product.', async () => {
    const { query, mutate } = await authenticatedTestClient();

    const connectionFragment = gql`
      fragment ConnectionFragment on ProductConnection {
        id
        attributesGroupId
        attributeId
        attribute {
          id
          nameString
        }
        productsIds
        products {
          value
          optionName
          node {
            id
            nameString
            slug
          }
        }
      }
    `;

    const cardFeaturesFragment = gql`
      fragment CardFeaturesFragment on ProductCardFeatures {
        listFeatures {
          showInCard
          viewVariant
          readableValue
          node {
            id
            nameString
          }
        }
        textFeatures {
          showInCard
          viewVariant
          readableValue
          node {
            id
            nameString
          }
        }
        tagFeatures {
          showInCard
          viewVariant
          readableValue
          node {
            id
            nameString
          }
        }
        iconFeatures {
          showInCard
          viewVariant
          readableValue
          node {
            id
            nameString
          }
        }
      }
    `;

    // Should return current product by slug
    const getProductBySlugPayload = await query<any>(gql`
      query {
        getProductBySlug(slug: "${mockData.productA.slug}") {
          id
          itemId
          nameString
          cardNameString
          originalName
          slug
          descriptionString
          rubrics
          brand {
            id
            nameString
            url
          }
          brandCollection {
            id
            nameString
          }
          manufacturer {
            id
            nameString
            url
          }
          cardPrices {
            min
            max
          }
          attributesGroups {
            node {
              id
            }
            attributes {
              value
              node {
                id
                slug
              }
            }
          }
          cardConnections {
            id
            nameString
            products {
              id
              value
              isCurrent
              product {
                id
                slug
              }
            }
          }
          cardBreadcrumbs(slug: "${mockData.rubricLevelOneA.slug}") {
            id
            name
            href
          }
          cardFeatures {
            ...CardFeaturesFragment
          }
          connections {
            ...ConnectionFragment
          }
          shopsCount
          shops {
            shop {
              id
              nameString
            }
            formattedPrice
            formattedOldPrice
            discountedPercent
            available
            price
            oldPrices {
              createdAt
              price
            }
          }
        }
      }
      ${connectionFragment}
      ${cardFeaturesFragment}
    `);
    const {
      data: { getProductBySlug },
    } = getProductBySlugPayload;
    const productA = getProductBySlug;
    expect(productA.slug).toEqual(mockData.productA.slug);
    expect(productA.cardBreadcrumbs).toBeDefined();

    const {
      data: { getProductBySlug: productB },
    } = await query<any>(gql`
      query {
        getProductBySlug(slug: "${mockData.productB.slug}") {
          id
          itemId
          slug
        }
      }
    `);

    // Should return product shops
    const getProductShopsPayload = await query<any>(
      gql`
        query GetProductShops($input: GetProductShopsInput!) {
          getProductShops(input: $input) {
            shop {
              id
              nameString
            }
            formattedPrice
            formattedOldPrice
            discountedPercent
            available
            price
            oldPrices {
              createdAt
              price
            }
          }
        }
      `,
      {
        variables: {
          input: {
            sortDir: SORT_ASC,
            sortBy: 'price',
            productId: productA.id,
          },
        },
      },
    );
    expect(getProductShopsPayload.data.getProductShops).toBeDefined();

    // Should return product by ID
    const {
      data: { getProduct, getRubricsTree },
    } = await query<any>(gql`
      query {
        getProduct(id: "${productA.id}") {
          id
          nameString
          slug
        }
        getRubricsTree {
          id
          nameString
          children {
            id
            nameString
            attributesGroups {
              node {
                id
                attributes {
                  id
                  slug
                  variant
                  optionsGroup {
                    id
                    options {
                      id
                    }
                  }
                }
              }
            }
            children {
              id
              nameString
            }
          }
        }
      }
    `);
    const rubricLevelOne = getRubricsTree[0];
    const rubricLevelTwo = rubricLevelOne.children[0];
    const rubricLevelTree = rubricLevelTwo.children[0];
    expect(getProduct.id).toEqual(productA.id);
    expect(getProduct.nameString).toEqual(productA.nameString);

    // Should create product connection
    const currentAttributesGroup = productA.attributesGroups.find(({ attributes }: any) => {
      return attributes.find(({ node }: any) => node.slug === mockData.attributeWineType.slug);
    });

    const currentAttribute = currentAttributesGroup.attributes.find(({ node }: any) => {
      return node.slug === mockData.attributeWineType.slug;
    });

    const createConnectionResult = await mutate<any>(
      gql`
        mutation CreateProductConnection($input: CreateProductConnectionInput!) {
          createProductConnection(input: $input) {
            success
            message
            product {
              id
              itemId
              nameString
              cardNameString
              slug
              descriptionString
              rubrics
              attributesGroups {
                attributes {
                  key
                  value
                }
              }
              cardFeatures {
                ...CardFeaturesFragment
              }
              connections {
                ...ConnectionFragment
              }
            }
          }
        }
        ${connectionFragment}
        ${cardFeaturesFragment}
      `,
      {
        variables: {
          input: {
            attributesGroupId: currentAttributesGroup.node.id,
            attributeId: currentAttribute.node.id,
            productId: productA.id,
          },
        },
      },
    );

    const {
      data: { createProductConnection },
    } = createConnectionResult;
    const createdConnection = createProductConnection.product.connections[0];
    expect(createProductConnection.success).toBeTruthy();
    expect(createdConnection.productsIds).toHaveLength(1);
    expect(createProductConnection.product.slug).toEqual(
      `${mockData.productA.slug}-${currentAttribute.node.slug}-${currentAttribute.value[0]}`,
    );

    // Should add product to connection
    const {
      data: { addProductToConnection },
    } = await mutate<any>(
      gql`
        mutation AddProductToConnection($input: AddProductToConnectionInput!) {
          addProductToConnection(input: $input) {
            success
            message
            product {
              id
              itemId
              nameString
              cardNameString
              slug
              descriptionString
              rubrics
              connections {
                ...ConnectionFragment
              }
            }
          }
        }
        ${connectionFragment}
      `,
      {
        variables: {
          input: {
            connectionId: createdConnection.id,
            productId: productA.id,
            addProductId: productB.id,
          },
        },
      },
    );
    expect(addProductToConnection.success).toBeTruthy();
    expect(addProductToConnection.product.connections[0].productsIds).toHaveLength(2);

    // Should delete product from connection
    const {
      data: { deleteProductFromConnection },
    } = await mutate<any>(
      gql`
        mutation DeleteProductFromConnection($input: DeleteProductFromConnectionInput!) {
          deleteProductFromConnection(input: $input) {
            success
            message
            product {
              id
              itemId
              nameString
              cardNameString
              slug
              descriptionString
              rubrics
              connections {
                ...ConnectionFragment
              }
            }
          }
        }
        ${connectionFragment}
      `,
      {
        variables: {
          input: {
            connectionId: createdConnection.id,
            productId: productA.id,
            deleteProductId: productB.id,
          },
        },
      },
    );
    const {
      data: { getProduct: removedProductFromConnection },
    } = await query<any>(
      gql`
        query GetProduct($id: ID!) {
          getProduct(id: $id) {
            slug
          }
        }
      `,
      {
        variables: {
          id: productB.id,
        },
      },
    );
    expect(deleteProductFromConnection.success).toBeTruthy();
    expect(deleteProductFromConnection.product.connections[0].productsIds).toHaveLength(1);
    expect(removedProductFromConnection.slug).toEqual(mockData.productB.slug);

    // Should delete connection if removed product is last in list
    const {
      data: { deleteProductFromConnection: deleteConnection },
    } = await mutate<any>(
      gql`
        mutation DeleteProductFromConnection($input: DeleteProductFromConnectionInput!) {
          deleteProductFromConnection(input: $input) {
            success
            message
            product {
              id
              itemId
              nameString
              cardNameString
              slug
              descriptionString
              rubrics
              connections {
                ...ConnectionFragment
              }
            }
          }
        }
        ${connectionFragment}
      `,
      {
        variables: {
          input: {
            connectionId: createdConnection.id,
            productId: productA.id,
            deleteProductId: productA.id,
          },
        },
      },
    );
    const removedConnection = await ProductConnectionModel.findById(createdConnection.id);
    expect(deleteConnection.success).toBeTruthy();
    expect(removedConnection).toBeNull();

    // Should return paginated products.
    const {
      data: { getAllProducts },
    } = await query<any>(
      gql`
        query GetAllProducts($input: ProductPaginateInput!) {
          getAllProducts(input: $input) {
            page
            totalDocs
            docs {
              id
              itemId
              nameString
              cardNameString
              slug
              descriptionString
              rubrics
              connections {
                ...ConnectionFragment
              }
              attributesGroups {
                showInCard
                node {
                  id
                  nameString
                }
                attributes {
                  showInCard
                  key
                  node {
                    id
                    nameString
                  }
                  value
                }
              }
              assets {
                index
                url
              }
              price
              createdAt
              updatedAt
            }
          }
        }
        ${connectionFragment}
      `,
      {
        variables: {
          input: {
            limit: 100,
            page: 1,
            sortBy: 'createdAt',
            sortDir: 'desc',
          },
        },
      },
    );
    expect(getAllProducts.totalDocs).toEqual(mockData.allProducts.length);
    expect(getAllProducts.docs).toHaveLength(mockData.allProducts.length);

    // Should return features AST
    const {
      data: { getFeaturesAst },
    } = await query<any>(gql`
      query {
        getFeaturesAst(selectedRubrics: ["${rubricLevelOne.id}"]) {
          id
          nameString
          attributes {
            id
            nameString
            optionsGroup {
              id
              nameString
              options {
                id
                nameString
                color
              }
            }
          }
        }
      }
    `);
    expect(getFeaturesAst).toBeDefined();

    // Should create product.
    const newProductName = faker.commerce.productName();
    const newProductDescription = faker.commerce.productDescription();
    const newProduct = {
      name: [
        { key: DEFAULT_LANG, value: newProductName },
        { key: SECONDARY_LANG, value: newProductName },
      ],
      cardName: [
        { key: DEFAULT_LANG, value: newProductName },
        { key: SECONDARY_LANG, value: newProductName },
      ],
      originalName: newProductName,
      description: [
        { key: DEFAULT_LANG, value: newProductDescription },
        { key: SECONDARY_LANG, value: newProductDescription },
      ],
    };
    const productAttributes = generateTestProductAttributes({ rubric: rubricLevelTwo });
    const createProductPayload = await mutateWithImages({
      mutation: gql`
        mutation CreateProduct($input: CreateProductInput!) {
          createProduct(input: $input) {
            success
            message
            product {
              id
              itemId
              nameString
              cardNameString
              slug
              descriptionString
              rubrics
              manufacturer {
                id
              }
              attributesGroups {
                showInCard
                node {
                  id
                  nameString
                }
                attributes {
                  showInCard
                  key
                  node {
                    id
                    nameString
                  }
                  value
                }
              }
              assets {
                index
                url
              }
              price
            }
          }
        }
      `,
      input: (images) => {
        return {
          name: newProduct.name,
          cardName: newProduct.cardName,
          originalName: newProduct.originalName,
          description: newProduct.description,
          rubrics: [rubricLevelTree.id],
          manufacturer: mockData.manufacturerA.slug,
          assets: images,
          ...productAttributes,
        };
      },
    });
    const {
      data: { createProduct },
    } = createProductPayload;
    const { product: createdProduct, success: createSuccess } = createProduct;
    expect(createSuccess).toBeTruthy();
    expect(createdProduct.nameString).toEqual(newProductName);
    expect(createdProduct.cardNameString).toEqual(newProductName);
    expect(createdProduct.descriptionString).toEqual(newProductDescription);
    expect(createdProduct.rubrics).toEqual([rubricLevelTree.id]);
    expect(createdProduct.manufacturer.id).toEqual(mockData.manufacturerA.id);
    expect(createdProduct.assets).toHaveLength(3);

    // Should update product.
    const updateProductValuesName = faker.commerce.productName();
    const updateProductValuesDescription = faker.commerce.productDescription();
    const updateProductValues = {
      name: [
        { key: DEFAULT_LANG, value: updateProductValuesName },
        { key: SECONDARY_LANG, value: updateProductValuesName },
      ],
      cardName: [
        { key: DEFAULT_LANG, value: updateProductValuesName },
        { key: SECONDARY_LANG, value: updateProductValuesName },
      ],
      originalName: newProductName,
      description: [
        { key: DEFAULT_LANG, value: updateProductValuesDescription },
        { key: SECONDARY_LANG, value: updateProductValuesDescription },
      ],
    };
    const updateProductPayload = await mutateWithImages({
      mutation: gql`
        mutation UpdateProduct($input: UpdateProductInput!) {
          updateProduct(input: $input) {
            success
            message
            product {
              id
              itemId
              nameString
              cardNameString
              slug
              descriptionString
              rubrics
              attributesGroups {
                showInCard
                node {
                  id
                  nameString
                }
                attributes {
                  showInCard
                  key
                  node {
                    id
                    nameString
                  }
                  value
                }
              }
              assets {
                index
                url
              }
              price
            }
          }
        }
      `,
      input: (images: Promise<Upload>[]) => {
        return {
          id: createdProduct.id,
          name: updateProductValues.name,
          cardName: updateProductValues.cardName,
          originalName: updateProductValues.originalName,
          description: updateProductValues.description,
          rubrics: [rubricLevelTree.id],
          assets: images,
          active: true,
          ...productAttributes,
        };
      },
    });
    const {
      data: { updateProduct },
    } = updateProductPayload;
    const { product: updatedProduct, success: updateSuccess } = updateProduct;
    expect(updateSuccess).toBeTruthy();
    expect(updatedProduct.nameString).toEqual(updateProductValuesName);
    expect(updatedProduct.cardNameString).toEqual(updateProductValuesName);
    expect(updatedProduct.descriptionString).toEqual(updateProductValuesDescription);
    expect(updatedProduct.rubrics).toEqual([rubricLevelTree.id]);

    // Should delete product
    const {
      data: { deleteProduct },
    } = await mutate<any>(
      gql`
        mutation DeleteProduct($id: ID!) {
          deleteProduct(id: $id) {
            success
            message
          }
        }
      `,
      {
        variables: {
          id: updatedProduct.id,
        },
      },
    );

    expect(deleteProduct.success).toBeTruthy();
  });
});
