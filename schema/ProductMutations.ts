import { noNaN } from 'lib/numbers';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import {
  AttributeModel,
  AttributesGroupModel,
  ManufacturerModel,
  ProductConnectionModel,
  ProductModel,
  ProductPayloadModel,
} from 'db/dbModels';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams, getResolverValidationSchema } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
} from 'db/collectionNames';
import {
  checkIsAllConnectionOptionsUsed,
  createProductSlugWithConnections,
} from 'lib/productConnectiosUtils';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { ASSETS_DIST_PRODUCTS, ATTRIBUTE_VARIANT_SELECT } from 'config/common';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  addProductToConnectionSchema,
  createProductConnectionSchema,
  createProductSchema,
  deleteProductFromConnectionSchema,
  addProductAssetsSchema,
  updateProductSchema,
} from 'validation/productSchema';
import { deleteUpload, reorderAssets, storeUploads } from 'lib/assets';

export const ProductPayload = objectType({
  name: 'ProductPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Product',
    });
  },
});

export const ProductAttributeInput = inputObjectType({
  name: 'ProductAttributeInput',
  definition(t) {
    t.nonNull.boolean('showInCard');
    t.nonNull.boolean('showAsBreadcrumb');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.nonNull.objectId('attributesGroupId');
    t.json('textI18n');
    t.float('number');
    t.nonNull.list.nonNull.field('selectedOptionsSlugs', {
      type: 'String',
      description: 'List of selected options slug',
    });
  },
});

export const CreateProductInput = inputObjectType({
  name: 'CreateProductInput',
  definition(t) {
    t.nonNull.boolean('active');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.list.nonNull.upload('assets');
    t.nonNull.list.nonNull.objectId('rubricsIds');
    t.string('brandSlug');
    t.string('brandCollectionSlug');
    t.string('manufacturerSlug');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttributeInput',
    });
  },
});

export const UpdateProductAssetsInput = inputObjectType({
  name: 'AddProductAssetsInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.list.nonNull.upload('assets');
  },
});

export const DeleteProductAssetInput = inputObjectType({
  name: 'DeleteProductAssetInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.int('assetIndex');
  },
});

export const UpdateProductAssetIndexInput = inputObjectType({
  name: 'UpdateProductAssetIndexInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.string('assetUrl');
    t.nonNull.int('assetNewIndex');
  },
});

export const UpdateProductInput = inputObjectType({
  name: 'UpdateProductInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.boolean('active');
    t.nonNull.string('originalName');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.list.nonNull.objectId('rubricsIds');
    t.string('brandSlug');
    t.string('brandCollectionSlug');
    t.string('manufacturerSlug');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'ProductAttributeInput',
    });
  },
});

export const CreateProductConnectionInput = inputObjectType({
  name: 'CreateProductConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('attributeId');
    t.nonNull.objectId('attributesGroupId');
  },
});

export const AddProductToConnectionInput = inputObjectType({
  name: 'AddProductToConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('addProductId');
    t.nonNull.objectId('connectionId');
  },
});

export const DeleteProductFromConnectionInput = inputObjectType({
  name: 'DeleteProductFromConnectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('deleteProductId');
    t.nonNull.objectId('connectionId');
  },
});

// Product Mutations
export const ProductMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should create product
    t.nonNull.field('createProduct', {
      type: 'ProductPayload',
      description: 'Should create product',
      args: {
        input: nonNull(
          arg({
            type: 'CreateProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createProductSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
          const brandsCollection = db.collection<ProductModel>(COL_BRANDS);
          const brandCollectionsCollection = db.collection<ProductModel>(COL_BRAND_COLLECTIONS);
          const { input } = args;
          const { manufacturerSlug, brandSlug, brandCollectionSlug, ...values } = input;

          const manufacturerEntity = manufacturerSlug
            ? await manufacturersCollection.findOne({ slug: manufacturerSlug })
            : null;
          const brandEntity = brandSlug
            ? await brandsCollection.findOne({ slug: brandSlug })
            : null;
          const brandCollectionEntity = brandCollectionSlug
            ? await brandCollectionsCollection.findOne({
                slug: brandCollectionSlug,
              })
            : null;

          // Store product assets
          const itemId = await getNextItemId(COL_PRODUCTS);
          const assets = await storeUploads({
            itemId,
            dist: ASSETS_DIST_PRODUCTS,
            files: input.assets,
          });

          // Create product
          const slug = generateDefaultLangSlug(values.nameI18n);

          const createdProductResult = await productsCollection.insertOne({
            ...values,
            itemId,
            assets,
            slug,
            manufacturerSlug: manufacturerEntity ? manufacturerEntity.slug : undefined,
            brandSlug: brandEntity ? brandEntity.slug : undefined,
            brandCollectionSlug: brandCollectionEntity ? brandCollectionEntity.slug : undefined,
            archive: false,
            active: true,
            priorities: {},
            views: {},
            shopProductsIds: [],
            shopProductsCountCities: {},
            minPriceCities: {},
            maxPriceCities: {},
            createdAt: new Date(),
            updatedAt: new Date(),
            attributes: values.attributes.map((attributeInput) => {
              const attributeSlugs: string[] = [];
              const { selectedOptionsSlugs, attributeSlug } = attributeInput;
              if (selectedOptionsSlugs.length > 0) {
                selectedOptionsSlugs.forEach((selectedOptionsSlug) => {
                  attributeSlugs.push(`${attributeSlug}-${selectedOptionsSlug}`);
                });
              }
              return {
                ...attributeInput,
                attributeSlugs,
              };
            }),
          });

          const createdProduct = createdProductResult.ops[0];
          if (!createdProductResult.result.ok || !createdProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.create.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.create.success'),
            payload: createdProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product
    t.nonNull.field('updateProduct', {
      type: 'ProductPayload',
      description: 'Should update product',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: updateProductSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage, locale } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, ...values } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Create new slug for product
          const { slug } = await createProductSlugWithConnections({
            product: {
              ...product,
              nameI18n: values.nameI18n,
            },
            locale,
          });

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                ...values,
                slug,
                updatedAt: new Date(),
                attributes: values.attributes.map((attributeInput) => {
                  const attributeSlugs: string[] = [];
                  const { selectedOptionsSlugs, attributeSlug } = attributeInput;
                  if (selectedOptionsSlugs.length > 0) {
                    selectedOptionsSlugs.forEach((selectedOptionsSlug) => {
                      attributeSlugs.push(`${attributeSlug}-${selectedOptionsSlug}`);
                    });
                  }
                  return {
                    ...attributeInput,
                    attributeSlugs,
                  };
                }),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add product assets
    t.nonNull.field('addProductAssets', {
      type: 'ProductPayload',
      description: 'Should add product assets',
      args: {
        input: nonNull(
          arg({
            type: 'AddProductAssetsInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addProductAssetsSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Update product assets
          const sortedAssets = product.assets.sort((assetA, assetB) => {
            return assetB.index - assetA.index;
          });
          const firstAsset = sortedAssets[0];
          const startIndex = noNaN(firstAsset?.index);
          const assets = await storeUploads({
            itemId: product.itemId,
            dist: ASSETS_DIST_PRODUCTS,
            files: input.assets,
            startIndex,
          });

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                updatedAt: new Date(),
              },
              $push: {
                assets: {
                  $each: assets,
                },
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete product asset
    t.nonNull.field('deleteProductAsset', {
      type: 'ProductPayload',
      description: 'Should update product assets',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductAssetInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, assetIndex } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Delete product asset
          const currentAsset = product.assets.find(({ index }) => index === assetIndex);
          const removedAsset = await deleteUpload({ filePath: `${currentAsset?.url}` });
          if (!removedAsset) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                updatedAt: new Date(),
              },
              $pull: {
                assets: {
                  index: assetIndex,
                },
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product asset index
    t.nonNull.field('updateProductAssetIndex', {
      type: 'ProductPayload',
      description: 'Should update product asset index',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductAssetIndexInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, assetNewIndex, assetUrl } = input;

          // Check product availability
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Reorder assets
          const reorderedAssetsWithUpdatedIndexes = reorderAssets({
            assetUrl,
            assetNewIndex,
            initialAssets: product.assets,
          });
          if (!reorderedAssetsWithUpdatedIndexes) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                assets: reorderedAssetsWithUpdatedIndexes,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should create product connection
    t.nonNull.field('createProductConnection', {
      type: 'ProductPayload',
      description: 'Should create product connection',
      args: {
        input: nonNull(
          arg({
            type: 'CreateProductConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: createProductConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage, locale } = await getRequestParams(context);
          const db = await getDatabase();
          const productConnectionsCollection = db.collection<ProductConnectionModel>(
            COL_PRODUCT_CONNECTIONS,
          );
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const attributesGroupsCollection = db.collection<AttributesGroupModel>(
            COL_ATTRIBUTES_GROUPS,
          );
          const { input } = args;
          const { productId, attributeId, attributesGroupId } = input;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const attribute = await attributesCollection.findOne({ _id: attributeId });
          const attributesGroup = await attributesGroupsCollection.findOne({
            _id: attributesGroupId,
          });

          if (!product || !attribute || !attributesGroup) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Check attribute variant. Must be as Select
          if (attribute.variant !== ATTRIBUTE_VARIANT_SELECT) {
            return {
              success: false,
              message: await getApiMessage(`products.update.attributeVariantError`),
            };
          }

          // Check if connection already exist
          const exist = await productConnectionsCollection.findOne({
            attributesGroupId,
            attributeId,
            productsIds: { $in: [productId] },
          });
          if (exist) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.exist`),
            };
          }

          // Create connection
          const createdConnectionResult = await productConnectionsCollection.insertOne({
            attributesGroupId,
            attributeId,
            productsIds: [productId],
          });
          if (!createdConnectionResult.result.ok) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.createError`),
            };
          }

          // Create new slug for product
          const { slug } = await createProductSlugWithConnections({
            product,
            locale,
          });

          // Update product
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: productId,
            },
            {
              $set: {
                slug,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.connection.createSuccess'),
            payload: updatedProduct,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should add product to connection
    t.nonNull.field('addProductToConnection', {
      type: 'ProductPayload',
      description: 'Should create product connection',
      args: {
        input: nonNull(
          arg({
            type: 'AddProductToConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: addProductToConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage, locale } = await getRequestParams(context);
          const db = await getDatabase();
          const productConnectionsCollection = db.collection<ProductConnectionModel>(
            COL_PRODUCT_CONNECTIONS,
          );
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, addProductId, connectionId } = input;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const addProduct = await productsCollection.findOne({ _id: addProductId });
          const connection = await productConnectionsCollection.findOne({ _id: connectionId });
          if (!product || !addProduct || !connection) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Check if all attribute options are used for connection
          const allOptionsAreUsed = await checkIsAllConnectionOptionsUsed({ connectionId });
          if (allOptionsAreUsed) {
            return {
              success: false,
              message: await getApiMessage('products.update.allOptionsAreUsed'),
            };
          }

          // Check attribute existence in added product
          const attributeExist = addProduct.attributes.some((productAttribute) => {
            return productAttribute.attributeId.equals(connection.attributeId);
          });
          if (!attributeExist) {
            return {
              success: false,
              message: await getApiMessage('products.connection.noAttributeError'),
            };
          }

          // Check attribute value in added product
          // it should have attribute value and shouldn't intersect with existing values in connection
          const connectionProducts = await productsCollection
            .find(
              { _id: { $in: connection.productsIds } },
              {
                projection: {
                  attributes: 1,
                },
              },
            )
            .toArray();
          const addProductConnectionAttribute = addProduct.attributes.find((attribute) => {
            return attribute.attributeId.equals(connection.attributeId);
          });
          if (!addProductConnectionAttribute) {
            return {
              success: false,
              message: await getApiMessage('products.connection.noAttributeError'),
            };
          }

          const connectionValues = connectionProducts.reduce((acc: string[], { attributes }) => {
            const attribute = attributes.find((attribute) => {
              return attribute.attributeId.equals(connection.attributeId);
            });
            if (!attribute) {
              return acc;
            }
            return [...acc, ...attribute.selectedOptionsSlugs];
          }, []);
          const includes = connectionValues.includes(
            addProductConnectionAttribute.selectedOptionsSlugs[0],
          );

          if (includes) {
            return {
              success: false,
              message: await getApiMessage('products.connection.intersect'),
            };
          }

          // Update connection
          const updatedConnectionResult = await productConnectionsCollection.findOneAndUpdate(
            { _id: connectionId },
            {
              $addToSet: {
                productsIds: addProduct._id,
              },
            },
          );
          if (!updatedConnectionResult.ok) {
            return {
              success: false,
              message: await getApiMessage(`products.connection.updateError`),
            };
          }

          // Create new slug for added product
          const { slug } = await createProductSlugWithConnections({
            product: addProduct,
            locale,
          });

          // Update product with new slug
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: addProductId,
            },
            {
              $set: {
                slug,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );
          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.connection.addProductSuccess'),
            payload: product,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should delete product from connection and delete connection
    // if there is no products left
    t.nonNull.field('deleteProductFromConnection', {
      type: 'ProductPayload',
      description: 'Should create product connection',
      args: {
        input: nonNull(
          arg({
            type: 'DeleteProductFromConnectionInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          // Validate
          const validationSchema = await getResolverValidationSchema({
            context,
            schema: deleteProductFromConnectionSchema,
          });
          await validationSchema.validate(args.input);

          const { getApiMessage } = await getRequestParams(context);
          const db = await getDatabase();
          const productConnectionsCollection = db.collection<ProductConnectionModel>(
            COL_PRODUCT_CONNECTIONS,
          );
          const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
          const { input } = args;
          const { productId, deleteProductId, connectionId } = input;
          const minimumProductsCountForConnectionDelete = 1;

          // Check all entities availability
          const product = await productsCollection.findOne({ _id: productId });
          const deleteProduct = await productsCollection.findOne({ _id: deleteProductId });
          const connection = await productConnectionsCollection.findOne({ _id: connectionId });

          if (!product || !deleteProduct || !connection) {
            return {
              success: false,
              message: await getApiMessage(`products.update.notFound`),
            };
          }

          // Update or delete connection
          if (connection.productsIds.length > minimumProductsCountForConnectionDelete) {
            const updatedConnectionResult = await productConnectionsCollection.findOneAndUpdate(
              { _id: connectionId },
              {
                $pull: {
                  productsIds: deleteProduct._id,
                },
              },
              { returnOriginal: false },
            );

            if (!updatedConnectionResult.ok || !updatedConnectionResult.value) {
              return {
                success: false,
                message: await getApiMessage(`products.connection.updateError`),
              };
            }
          } else {
            const removedConnectionResult = await productConnectionsCollection.findOneAndDelete({
              _id: connectionId,
            });

            if (!removedConnectionResult.ok) {
              return {
                success: false,
                message: await getApiMessage(`products.connection.deleteError`),
              };
            }
          }

          // Create new slug for removed product
          const slug = generateDefaultLangSlug(deleteProduct.nameI18n);

          // Update product with new slug
          const updatedProductResult = await productsCollection.findOneAndUpdate(
            {
              _id: deleteProductId,
            },
            {
              $set: {
                slug,
                updatedAt: new Date(),
              },
            },
            {
              returnOriginal: false,
            },
          );

          const updatedProduct = updatedProductResult.value;
          if (!updatedProductResult.ok || !updatedProduct) {
            return {
              success: false,
              message: await getApiMessage(`products.update.error`),
            };
          }

          // Return updated product if args products ids is the same
          const isSameProduct = productId.equals(deleteProductId);

          return {
            success: true,
            message: await getApiMessage('products.connection.deleteProductSuccess'),
            payload: isSameProduct ? updatedProduct : product,
          };
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
