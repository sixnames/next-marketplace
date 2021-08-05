import { COL_PRODUCT_CARD_CONTENTS } from 'db/collectionNames';
import { ProductCardContentModel, ProductCardContentPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';

export const ProductCardContent = objectType({
  name: 'ProductCardContent',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.string('productSlug');
    t.nonNull.json('content');
    t.nonNull.list.nonNull.string('assetKeys');
  },
});

export const ProductCardContentPayload = objectType({
  name: 'ProductCardContentPayload',
  definition(t) {
    t.implements('Payload');
    t.field('payload', {
      type: 'ProductCardContent',
    });
  },
});

export const UpdateProductCardContentInput = inputObjectType({
  name: 'UpdateProductCardContentInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.string('productSlug');
    t.nonNull.string('companySlug');
    t.nonNull.json('content');
    t.nonNull.list.nonNull.string('assetKeys');
  },
});

export const ProductCardContentMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update / create product card content
    t.nonNull.field('updateProductCardContent', {
      type: 'ProductCardContentPayload',
      description: 'Should update / create product card content',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductCardContentInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductCardContentPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const productCardContentsCollection =
            db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);

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

          const { input } = args;
          const { _id, ...values } = input;
          const updatedProductCardContentResult =
            await productCardContentsCollection.findOneAndUpdate(
              {
                _id,
              },
              {
                $set: values,
              },
              {
                returnDocument: 'after',
                upsert: true,
              },
            );
          const updatedProductCardContent = updatedProductCardContentResult.value;
          if (!updatedProductCardContentResult.ok || !updatedProductCardContent) {
            return {
              success: false,
              message: await getApiMessage('products.update.error'),
            };
          }

          return {
            success: true,
            message: await getApiMessage('products.update.success'),
            payload: updatedProductCardContent,
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
