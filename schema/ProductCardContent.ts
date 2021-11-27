import { ProductPayloadModel } from 'db/dbModels';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { updateCitiesSeoText } from 'lib/seoTextUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { arg, extendType, inputObjectType, nonNull } from 'nexus';

export const UpdateProductCardContentInput = inputObjectType({
  name: 'UpdateProductCardContentInput',
  definition(t) {
    t.nonNull.json('content');
    t.nonNull.string('companySlug');
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
          const { content, companySlug } = input;
          await updateCitiesSeoText({
            seoTextsList: content,
            companySlug,
          });

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
