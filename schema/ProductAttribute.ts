import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { DEFAULT_LOCALE, FILTER_SEPARATOR } from '../config/common';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_FACETS,
  COL_SHOP_PRODUCTS,
  COL_PRODUCT_SUMMARIES,
} from '../db/collectionNames';
import {
  AttributeModel,
  OptionModel,
  ProductFacetModel,
  ProductPayloadModel,
  ShopProductModel,
  ProductSummaryModel,
  ObjectIdModel,
} from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from '../lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from '../lib/sessionHelpers';
import { getParentTreeIds } from '../lib/treeUtils';
import { execUpdateProductTitles } from '../lib/updateProductTitles';

export const ProductAttribute = objectType({
  name: 'ProductAttribute',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.json('textI18n');
    t.float('number');
  },
});

export const ProductPayload = objectType({
  name: 'ProductPayload',
  definition(t) {
    t.implements('Payload');
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
        const productSummariesCollection =
          db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
        const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
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
            const summary = await productSummariesCollection.findOne({ _id: productId });
            if (!summary) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedSummaryResult = await productSummariesCollection.findOneAndUpdate(
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
            if (!updatedSummaryResult.ok) {
              mutationPayload = {
                success: false,
                message: await getApiMessage('products.update.error'),
              };
              await session.abortTransaction();
              return;
            }

            const updatedFacetResult = await productFacetsCollection.findOneAndUpdate(
              {
                _id: productId,
              },
              {
                $set: {
                  manufacturerSlug,
                },
              },
              {
                returnDocument: 'after',
              },
            );
            if (!updatedFacetResult.ok) {
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
            const finalOptionIds: ObjectIdModel[] = [];
            for await (const optionId of selectedOptionsIds) {
              const optionsTreeIds = await getParentTreeIds({
                collectionName: COL_OPTIONS,
                _id: optionId,
                acc: [],
              });
              optionsTreeIds.forEach((_id) => finalOptionIds.push(_id));
            }
            const finalOptions = await optionsCollection
              .find({
                _id: {
                  $in: finalOptionIds,
                },
              })
              .toArray();

            // Update or create product attribute
            const finalFilterSlugs = finalOptions.map(
              ({ slug }) => `${attribute.slug}${FILTER_SEPARATOR}${slug}`,
            );

            const oldFilterSlugs = [...productAttribute.filterSlugs];

            const readableValueI18n = getAttributeReadableValueLocales({
              productAttribute: {
                ...productAttribute,
                attribute: {
                  ...attribute,
                  options: finalOptions,
                },
              },
              gender: summary.gender,
            });
            productAttribute.readableValueI18n = readableValueI18n;

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
                    attributeIds: attributeId,
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
                    attributeIds: attributeId,
                    filterSlugs: {
                      $each: finalFilterSlugs,
                    },
                  },
                },
              );

              // update product title
              execUpdateProductTitles(`productId=${summary._id.toHexString()}`);

              mutationPayload = {
                success: true,
                message: await getApiMessage('products.update.success'),
              };
              return;
            }

            // remove attribute if value is empty
            if (finalOptionIds.length < 1) {
              const updatedProductAttributeResult =
                await productSummariesCollection.findOneAndUpdate(
                  {
                    _id: summary._id,
                  },
                  {
                    $pull: {
                      attributeIds: attributeId,
                      attributes: {
                        attributeId,
                      },
                    },
                    $pullAll: {
                      filterSlugs: oldFilterSlugs,
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
                    filterSlugs: oldFilterSlugs,
                  },
                },
              );
              await productFacetsCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $pull: {
                    attributeIds: attributeId,
                  },
                  $pullAll: {
                    filterSlugs: oldFilterSlugs,
                  },
                },
              );

              // update product title
              execUpdateProductTitles(`productId=${summary._id.toHexString()}`);

              mutationPayload = {
                success: true,
                message: await getApiMessage('products.update.success'),
              };
              return;
            }

            // update attribute
            const updatedFilterSlugs = summary.filterSlugs.reduce((acc: string[], filterSlug) => {
              if (oldFilterSlugs.includes(filterSlug)) {
                return acc;
              }
              return [...acc, filterSlug];
            }, finalFilterSlugs);
            const updatedProductAttributeResult = await productSummariesCollection.findOneAndUpdate(
              {
                _id: summary._id,
              },
              {
                $set: {
                  'attributes.$[oldAttribute]': {
                    ...productAttribute,
                    optionIds: finalOptionIds,
                    filterSlugs: finalFilterSlugs,
                  },
                  filterSlugs: updatedFilterSlugs,
                },
              },
              {
                arrayFilters: [
                  {
                    'oldAttribute._id': productAttribute._id,
                  },
                ],
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
                $set: {
                  filterSlugs: updatedFilterSlugs,
                },
              },
            );
            await productFacetsCollection.findOneAndUpdate(
              {
                _id: summary._id,
              },
              {
                $set: {
                  filterSlugs: updatedFilterSlugs,
                },
              },
            );

            // update product title
            execUpdateProductTitles(`productId=${summary._id.toHexString()}`);
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
          const productSummariesCollection =
            db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
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
          const summary = await productSummariesCollection.findOne({ _id: productId });
          if (!summary) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          for await (const inputAttribute of attributes) {
            const { number, attributeId, productAttributeId } = inputAttribute;
            if (!number) {
              await productSummariesCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $pull: {
                    attributeIds: attributeId,
                    attributes: {
                      attributeId,
                    },
                  },
                },
              );
              continue;
            }

            // Check if product attribute exist
            let productAttribute = summary.attributes.find(({ _id }) => {
              return _id.equals(productAttributeId);
            });

            const attribute = await attributesCollection.findOne({ _id: attributeId });
            if (!attribute) {
              continue;
            }
            const productAttributeNotExist = !productAttribute;

            // Create new product attribute if original is absent
            if (!productAttribute) {
              productAttribute = {
                _id: productAttributeId,
                attributeId,
                optionIds: [],
                filterSlugs: [],
                number,
                textI18n: {},
                readableValueI18n: {},
              };
            }
            const readableValueI18n = getAttributeReadableValueLocales({
              productAttribute: {
                ...productAttribute,
                attribute,
              },
              gender: summary.gender,
            });
            productAttribute.readableValueI18n = readableValueI18n;

            if (productAttributeNotExist) {
              await productSummariesCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $push: {
                    attributes: productAttribute,
                  },
                },
              );
            } else {
              await productSummariesCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $set: {
                    'attributes.$[oldAttribute]': {
                      ...productAttribute,
                      number: inputAttribute.number,
                    },
                  },
                },
                {
                  arrayFilters: [{ 'oldAttribute._id': { $eq: productAttribute._id } }],
                },
              );
            }
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: summary,
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
          const productSummariesCollection =
            db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
          const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
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
          const summary = await productSummariesCollection.findOne({ _id: productId });
          if (!summary) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          for await (const inputAttribute of attributes) {
            const { textI18n, attributeId, productAttributeId } = inputAttribute;
            if (!textI18n || !textI18n[DEFAULT_LOCALE]) {
              await productSummariesCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $pull: {
                    attributeIds: attributeId,
                    attributes: {
                      attributeId,
                    },
                  },
                },
              );
              continue;
            }

            // Check if product attribute exist
            let productAttribute = await summary.attributes.find(({ _id }) => {
              return _id.equals(productAttributeId);
            });

            const attribute = await attributesCollection.findOne({ _id: attributeId });
            if (!attribute) {
              continue;
            }
            const productAttributeNotExist = !productAttribute;

            // Create new product attribute if original is absent
            if (!productAttribute) {
              productAttribute = {
                _id: productAttributeId,
                attributeId,
                optionIds: [],
                filterSlugs: [],
                number: null,
                textI18n,
                readableValueI18n: {},
              };
            }
            const readableValueI18n = getAttributeReadableValueLocales({
              productAttribute: {
                ...productAttribute,
                attribute,
              },
              gender: summary.gender,
            });
            productAttribute.readableValueI18n = readableValueI18n;

            if (productAttributeNotExist) {
              await productSummariesCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $push: {
                    attributes: productAttribute,
                  },
                },
              );
            } else {
              await productSummariesCollection.findOneAndUpdate(
                {
                  _id: summary._id,
                },
                {
                  $set: {
                    'attributes.$[oldAttribute]': {
                      ...productAttribute,
                      textI18n: inputAttribute.textI18n,
                    },
                  },
                },
                {
                  arrayFilters: [{ 'oldAttribute._id': { $eq: productAttribute._id } }],
                },
              );
            }
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: summary,
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
