import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { FILTER_SEPARATOR } from '../config/common';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_FACETS,
  COL_SHOP_PRODUCTS,
  COL_PRODUCT_SUMMARIES,
} from '../db/collectionNames';
import {
  AttributeModel,
  OptionModel,
  ProductAttributeModel,
  ProductFacetModel,
  ProductPayloadModel,
  ShopProductModel,
  ProductSummaryModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { noNaN } from '../lib/numbers';
import { getOperationPermission, getRequestParams } from '../lib/sessionHelpers';

export const ProductAttribute = objectType({
  name: 'ProductAttribute',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.json('textI18n');
    t.float('number');

    // ProductAttribute text translation field resolver
    t.nonNull.field('text', {
      type: 'String',
      resolve: async (source, _args, context) => {
        if (!source.textI18n) {
          return '';
        }
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.textI18n);
      },
    });

    // ProductAttribute attribute field resolver
    t.nonNull.field('attribute', {
      type: 'Attribute',
      resolve: async (source): Promise<AttributeModel> => {
        const { db } = await getDatabase();
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const attribute = await attributesCollection.findOne({ _id: source.attributeId });
        if (!attribute) {
          throw Error('Attribute not found in ProductAttribute');
        }
        return attribute;
      },
    });
  },
});

export const ProductPayload = objectType({
  name: 'ProductPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'Product',
    });
  },
});

export const UpdateProductBrandInput = inputObjectType({
  name: 'UpdateProductBrandInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.string('brandSlug');
  },
});

export const UpdateProductBrandCollectionInput = inputObjectType({
  name: 'UpdateProductBrandCollectionInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.string('brandCollectionSlug');
  },
});

export const UpdateProductManufacturerInput = inputObjectType({
  name: 'UpdateProductManufacturerInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.string('manufacturerSlug');
  },
});

export const UpdateProductSelectAttributeInput = inputObjectType({
  name: 'UpdateProductSelectAttributeInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.objectId('productAttributeId');
    t.nonNull.objectId('attributeId');
    t.nonNull.list.nonNull.objectId('selectedOptionsIds');
  },
});

export const UpdateProductNumberAttributeItemInput = inputObjectType({
  name: 'UpdateProductNumberAttributeItemInput',
  definition(t) {
    t.nonNull.objectId('productAttributeId');
    t.nonNull.objectId('attributeId');
    t.float('number');
  },
});

export const UpdateProductNumberAttributeInput = inputObjectType({
  name: 'UpdateProductNumberAttributeInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'UpdateProductNumberAttributeItemInput',
    });
  },
});

export const UpdateProductTextAttributeItemInput = inputObjectType({
  name: 'UpdateProductTextAttributeItemInput',
  definition(t) {
    t.nonNull.objectId('productAttributeId');
    t.nonNull.objectId('attributeId');
    t.json('textI18n');
  },
});

export const UpdateProductTextAttributeInput = inputObjectType({
  name: 'UpdateProductTextAttributeInput',
  definition(t) {
    t.nonNull.objectId('productId');
    t.nonNull.list.nonNull.field('attributes', {
      type: 'UpdateProductTextAttributeItemInput',
    });
  },
});

export const ProductAttributeMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update product brand
    t.nonNull.field('updateProductBrand', {
      type: 'ProductPayload',
      description: 'Should update product brand',
      args: {
        input: nonNull(arg({ type: 'UpdateProductBrandInput' })),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: ProductPayloadModel = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            const { input } = args;
            const { productId, brandSlug } = input;

            // Check product availability
            const product = await productsCollection.findOne({ _id: productId });
            if (!product) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedProductResult = await productsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $set: {
                  brandSlug,
                  brandCollectionSlug: brandSlug ? product.brandCollectionSlug : null,
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedProduct = updatedProductResult.value;
            if (!updatedProductResult.ok || !updatedProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedShopProduct = await shopProductsCollection.updateMany(
              {
                productId,
              },
              {
                $set: {
                  brandSlug,
                  brandCollectionSlug: brandSlug ? product.brandCollectionSlug : null,
                  updatedAt: new Date(),
                },
              },
            );
            if (!updatedShopProduct.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.update.success'),
              payload: updatedProduct,
            };
          });

          return mutationPayload;
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });

    // Should update product brand collection
    t.nonNull.field('updateProductBrandCollection', {
      type: 'ProductPayload',
      description: 'Should update product brand collection',
      args: {
        input: nonNull(arg({ type: 'UpdateProductBrandCollectionInput' })),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: ProductPayloadModel = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            const { input } = args;
            const { productId, brandCollectionSlug } = input;

            // Check product availability
            const product = await productsCollection.findOne({ _id: productId });
            if (!product) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedProductResult = await productsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $set: {
                  brandCollectionSlug,
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedProduct = updatedProductResult.value;
            if (!updatedProductResult.ok || !updatedProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedShopProduct = await shopProductsCollection.updateMany(
              {
                productId,
              },
              {
                $set: {
                  brandCollectionSlug,
                  updatedAt: new Date(),
                },
              },
            );
            if (!updatedShopProduct.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.update.success'),
              payload: updatedProduct,
            };
          });

          return mutationPayload;
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });

    // Should update product manufacturer
    t.nonNull.field('updateProductManufacturer', {
      type: 'ProductPayload',
      description: 'Should update product manufacturer',
      args: {
        input: nonNull(arg({ type: 'UpdateProductManufacturerInput' })),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

        const session = client.startSession();

        let mutationPayload: ProductPayloadModel = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            const { input } = args;
            const { productId, manufacturerSlug } = input;

            // Check product availability
            const product = await productsCollection.findOne({ _id: productId });
            if (!product) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedProductResult = await productsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $set: {
                  manufacturerSlug,
                  updatedAt: new Date(),
                },
              },
              {
                returnDocument: 'after',
              },
            );
            const updatedProduct = updatedProductResult.value;
            if (!updatedProductResult.ok || !updatedProduct) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedShopProduct = await shopProductsCollection.updateMany(
              {
                productId,
              },
              {
                $set: {
                  manufacturerSlug,
                  updatedAt: new Date(),
                },
              },
            );
            if (!updatedShopProduct.acknowledged) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.update.success'),
              payload: updatedProduct,
            };
          });

          return mutationPayload;
        } catch (e) {
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });

    // Should update product select attribute
    t.nonNull.field('updateProductSelectAttribute', {
      type: 'ProductPayload',
      description: 'Should update product select attribute',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductSelectAttributeInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        const { getApiMessage } = await getRequestParams(context);
        const { db, client } = await getDatabase();
        const productSummariesCollection =
          db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
        const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
        const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
        const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
        const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

        const session = client.startSession();

        let mutationPayload: ProductPayloadModel = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };

        try {
          await session.withTransaction(async () => {
            // Permission
            const { allow, message } = await getOperationPermission({
              context,
              slug: 'updateProduct',
            });
            if (!allow) {
              mutationPayload = {
                success: false,
                message,
              };
              await session.abortTransaction();
              return;
            }

            const { input } = args;
            const { selectedOptionsIds, productId, attributeId, productAttributeId } = input;

            // Check if product exist
            const summary = await productSummariesCollection.findOne({ _id: productId });
            if (!summary) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            // Check if product attribute exist
            let productAttribute = summary.attributes.find((productAttribute) => {
              return productAttribute.attributeId.equals(attributeId);
            });

            // Check attribute availability
            const attribute = await attributesCollection.findOne({ _id: attributeId });
            if (!attribute) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }
            const productAttributeNotExist = !productAttribute;

            // Create new product attribute if original is absent
            if (!productAttribute) {
              productAttribute = {
                _id: productAttributeId,
                attributeId,
                optionIds: [],
                filterSlugs: [],
                number: undefined,
                textI18n: {},
                readableValueI18n: {},
              };
            }

            // Get selected options tree
            const finalOptions: OptionModel[] = [];
            if (selectedOptionsIds.length > 0) {
              const optionsAggregation = await optionsCollection
                .aggregate<OptionModel>([
                  {
                    $match: {
                      _id: {
                        $in: selectedOptionsIds,
                      },
                    },
                  },
                  {
                    $graphLookup: {
                      from: COL_OPTIONS,
                      as: 'options',
                      startWith: '$parentId',
                      connectFromField: 'parentId',
                      connectToField: '_id',
                      depthField: 'level',
                    },
                  },
                ])
                .toArray();

              // sort parent options in descendant order for each selected option
              optionsAggregation.forEach((selectedOptionTree) => {
                const { options, ...restOption } = selectedOptionTree;

                const sortedOptions = (options || []).sort((a, b) => {
                  return noNaN(b.level) - noNaN(a.level);
                });

                const treeQueue = [...sortedOptions, restOption];
                treeQueue.forEach((finalOption) => {
                  finalOptions.push(finalOption);
                });
              });
            }

            // Update or create product attribute
            const finalOptionIds = finalOptions.map(({ _id }) => _id);
            const finalFilterSlugs = finalOptions.map(
              ({ slug }) => `${attribute.slug}${FILTER_SEPARATOR}${slug}`,
            );

            // add new product attribute if not exist
            if (productAttributeNotExist && finalOptionIds.length > 0) {
              const updatedSummaryResult = await productSummariesCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $push: {
                    attributes: {
                      ...productAttribute,
                      optionIds: finalOptionIds,
                      filterSlugs: finalFilterSlugs,
                    },
                  },
                  $addToSet: {
                    filterSlugs: {
                      $each: finalFilterSlugs,
                    },
                  },
                },
              );
              if (!updatedSummaryResult.ok) {
                mutationPayload = {
                  success: false,
                  message: await getApiMessage('products.update.error'),
                };
                await session.abortTransaction();
                return;
              }

              await shopProductsCollection.updateMany(
                {
                  productId: summary._id,
                },
                {
                  $addToSet: {
                    filterSlugs: {
                      $each: finalFilterSlugs,
                    },
                  },
                },
              );
              await productFacetsCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $addToSet: {
                    filterSlugs: {
                      $each: finalFilterSlugs,
                    },
                  },
                },
              );
              mutationPayload = {
                success: true,
                message: await getApiMessage('products.update.success'),
              };
              return;
            }

            // Update product
            const updatedProductAttributeResult = await productSummariesCollection.findOneAndUpdate(
              {
                _id: summary._id,
              },
              {
                $pull: {
                  'attributes.attributeId': attributeId,
                },
                $pullAll: {
                  filterSlugs: productAttribute.filterSlugs,
                },
              },
            );
            if (!updatedProductAttributeResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }
            await shopProductsCollection.updateMany(
              {
                productId: summary._id,
              },
              {
                $pullAll: {
                  filterSlugs: productAttribute.filterSlugs,
                },
              },
            );
            await productFacetsCollection.findOneAndUpdate(
              {
                _id: summary._id,
              },
              {
                $pullAll: {
                  filterSlugs: productAttribute.filterSlugs,
                },
              },
            );

            mutationPayload = {
              success: true,
              message: await getApiMessage('products.update.success'),
              payload: summary,
            };
          });

          return mutationPayload;
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        } finally {
          await session.endSession();
        }
      },
    });

    // Should update product number attribute
    t.nonNull.field('updateProductNumberAttribute', {
      type: 'ProductPayload',
      description: 'Should update product number attribute',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductNumberAttributeInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const productAttributesCollection =
            db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
          const { input } = args;
          const { productId, attributes } = input;

          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateProduct',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Check if product exist
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          for await (const attributesItem of attributes) {
            const { number, attributeId, productAttributeId } = attributesItem;

            // Check if product attribute exist
            let productAttribute = await productAttributesCollection.findOne({
              _id: productAttributeId,
            });

            // Create new product attribute if original is absent
            if (!productAttribute) {
              const attribute = await attributesCollection.findOne({ _id: attributeId });

              if (!attribute) {
                return {
                  success: false,
                  message: await getApiMessage('products.update.error'),
                };
              }

              productAttribute = {
                _id: productAttributeId,
                attributeId,
                productId: product._id,
                productSlug: product.slug,
                rubricId: product.rubricId,
                rubricSlug: product.rubricSlug,
                selectedOptionsIds: [],
                filterSlugs: [],
                number: undefined,
                textI18n: {},
                readableValueI18n: {},
              };
            }

            // Update or create product attribute
            const { _id, ...restProductAttribute } = productAttribute;
            await productAttributesCollection.findOneAndUpdate(
              {
                _id,
              },
              {
                $set: {
                  ...restProductAttribute,
                  number,
                },
              },
              {
                upsert: true,
                returnDocument: 'after',
              },
            );
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: product,
          };
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });

    // Should update product text attribute
    t.nonNull.field('updateProductTextAttribute', {
      type: 'ProductPayload',
      description: 'Should update product text attribute',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductTextAttributeInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
          const productAttributesCollection =
            db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
          const { input } = args;
          const { productId, attributes } = input;

          // Permission
          const { allow, message } = await getOperationPermission({
            context,
            slug: 'updateProduct',
          });
          if (!allow) {
            return {
              success: false,
              message,
            };
          }

          // Check if product exist
          const product = await productsCollection.findOne({ _id: productId });
          if (!product) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          for await (const attributesItem of attributes) {
            const { textI18n, attributeId, productAttributeId } = attributesItem;

            // Check if product attribute exist
            let productAttribute = await productAttributesCollection.findOne({
              _id: productAttributeId,
            });

            // Create new product attribute if original is absent
            if (!productAttribute) {
              const attribute = await attributesCollection.findOne({ _id: attributeId });

              if (!attribute) {
                return {
                  success: false,
                  message: await getApiMessage('products.update.error'),
                };
              }

              productAttribute = {
                _id: productAttributeId,
                attributeId,
                productId: product._id,
                productSlug: product.slug,
                rubricId: product.rubricId,
                rubricSlug: product.rubricSlug,
                selectedOptionsIds: [],
                filterSlugs: [],
                number: undefined,
                textI18n: {},
                readableValueI18n: {},
              };
            }

            // Update or create product attribute
            const { _id, ...restProductAttribute } = productAttribute;
            await productAttributesCollection.findOneAndUpdate(
              {
                _id,
              },
              {
                $set: {
                  ...restProductAttribute,
                  textI18n,
                },
              },
              {
                upsert: true,
                returnDocument: 'after',
              },
            );
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: product,
          };
        } catch (e) {
          console.log(e);
          return {
            success: false,
            message: getResolverErrorMessage(e),
          };
        }
      },
    });
  },
});
