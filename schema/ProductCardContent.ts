import { COL_SEO_CONTENTS } from 'db/collectionNames';
import { ProductPayloadModel, SeoContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, nonNull } from 'nexus';

export const UpdateProductCardContentInput = inputObjectType({
  name: 'UpdateProductCardContentInput',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.string('url');
    t.nonNull.string('content');
  },
});

export const ProductCardContentMutations = extendType({
  type: 'Mutation',
  definition(t) {
    // Should update / create product card content
    t.nonNull.field('updateProductCardContent', {
      type: 'ProductPayload',
      description: 'Should update / create product card content',
      args: {
        input: nonNull(
          arg({
            type: 'UpdateProductCardContentInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<ProductPayloadModel> => {
        try {
          const { getApiMessage } = await getRequestParams(context);
          const { db } = await getDatabase();
          const productCardContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

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
