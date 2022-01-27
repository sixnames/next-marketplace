import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { DEFAULT_LOCALE } from '../config/common';
import { COL_ATTRIBUTES, COL_PRODUCT_SUMMARIES } from '../db/collectionNames';
import { AttributeModel, ProductPayloadModel, ProductSummaryModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import getResolverErrorMessage from '../lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from '../lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from '../lib/sessionHelpers';

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
