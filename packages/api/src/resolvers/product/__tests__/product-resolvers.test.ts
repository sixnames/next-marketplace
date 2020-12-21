import { mutateWithImages, authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { anotherProduct, testProduct } from '../__fixtures__';
import { Upload } from '../../../types/upload';
import { generateTestProductAttributes } from '../../../utils/testUtils/generateTestProductAttributes';
import { gql } from 'apollo-server-express';
import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { ProductConnectionModel } from '../../../entities/ProductConnection';
import { SORT_ASC } from '@yagu/config';

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
    const {
      data: { getProductBySlug },
    } = await query<any>(gql`
      query {
        getProductBySlug(slug: "${mockData.productA.slug}") {
          id
          itemId
          nameString
          cardNameString
          slug
          descriptionString
          rubrics
          cardPrices {
            min
            max
          }
          attributesGroups {
            node {
              id
            }
            attributes {
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
          cardBreadcrumbs(rubricSlug: "${mockData.rubricLevelOneA.slug}") {
            id
            name
            slug
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
    const currentProduct = getProductBySlug;
    expect(currentProduct.slug).toEqual(mockData.productA.slug);
    expect(currentProduct.cardBreadcrumbs).toBeDefined();

    const {
      data: { getProductBySlug: secondaryProduct },
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
            productId: currentProduct.id,
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
        getProduct(id: "${currentProduct.id}") {
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
    expect(getProduct.id).toEqual(currentProduct.id);
    expect(getProduct.nameString).toEqual(currentProduct.nameString);
    const productAttributes = generateTestProductAttributes({ rubric: rubricLevelTwo });

    // Should create product connection
    const currentAttributesGroup = currentProduct.attributesGroups.find(({ attributes }: any) => {
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
            productId: currentProduct.id,
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
    expect(createProductConnection.product.slug).toEqual(`cardnameproducta-tip_vina-vermut`);

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
            productId: currentProduct.id,
            addProductId: secondaryProduct.id,
          },
        },
      },
    );
    const slugs = addProductToConnection.product.connections[0].products.map(
      ({ node }: any) => node.slug,
    );

    const addedProductSlug = slugs.find(
      (slug: string) => slug === 'cardnameproductb-tip_vina-vermut',
    );

    expect(addProductToConnection.success).toBeTruthy();
    expect(addProductToConnection.product.connections[0].productsIds).toHaveLength(2);
    expect(addedProductSlug).toBeDefined();

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
            productId: currentProduct.id,
            deleteProductId: secondaryProduct.id,
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
          id: secondaryProduct.id,
        },
      },
    );
    expect(deleteProductFromConnection.success).toBeTruthy();
    expect(deleteProductFromConnection.product.connections[0].productsIds).toHaveLength(1);
    expect(removedProductFromConnection.slug).toEqual('cardnameproductb');

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
            productId: currentProduct.id,
            deleteProductId: currentProduct.id,
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
            page
            totalDocs
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
    expect(getAllProducts).toBeDefined();

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
      input: (images) => {
        return {
          name: testProduct.name,
          cardName: testProduct.cardName,
          price: testProduct.price,
          description: testProduct.description,
          rubrics: [rubricLevelTree.id],
          assets: images,
          ...productAttributes,
        };
      },
    });

    const { product: createdProduct, success: createSuccess } = createProduct;

    expect(createSuccess).toBeTruthy();
    expect(createdProduct.nameString).toEqual(testProduct.name[0].value);
    expect(createdProduct.cardNameString).toEqual(testProduct.cardName[0].value);
    expect(createdProduct.descriptionString).toEqual(testProduct.description[0].value);
    expect(createdProduct.price).toEqual(testProduct.price);
    expect(createdProduct.rubrics).toEqual([rubricLevelTree.id]);
    expect(createdProduct.assets).toHaveLength(3);

    // Should update product.
    const {
      data: { updateProduct },
    } = await mutateWithImages({
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
          name: anotherProduct.name,
          cardName: anotherProduct.cardName,
          price: anotherProduct.price,
          description: anotherProduct.description,
          rubrics: [rubricLevelTree.id],
          assets: images,
          active: true,
          ...productAttributes,
        };
      },
    });

    const { product: updatedProduct, success: updateSuccess } = updateProduct;

    expect(updateSuccess).toBeTruthy();
    expect(updatedProduct.nameString).toEqual(anotherProduct.name[0].value);
    expect(updatedProduct.cardNameString).toEqual(anotherProduct.cardName[0].value);
    expect(updatedProduct.descriptionString).toEqual(anotherProduct.description[0].value);
    expect(updatedProduct.price).toEqual(anotherProduct.price);
    expect(updatedProduct.rubrics).toEqual([rubricLevelTree.id]);
    expect(updatedProduct.assets).toHaveLength(3);

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
