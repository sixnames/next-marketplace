import { RubricPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteRubricInputInterface {
  _id: string;
}

export async function deleteRubric({
  context,
  input,
}: DaoPropsInterface<DeleteRubricInputInterface>): Promise<RubricPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const rubricsCollection = collections.rubricsCollection();
  const productFacetsCollection = collections.productFacetsCollection();
  const productSummariesCollection = collections.productSummariesCollection();
  const shopProductsCollection = collections.shopProductsCollection();
  const categoriesCollection = collections.categoriesCollection();

  const session = collections.client.startSession();

  let mutationPayload: RubricPayloadModel = {
    success: false,
    message: await getApiMessage('rubrics.delete.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'deleteRubric',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // check input
      if (!input) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      // get rubric
      const rubricId = new ObjectId(input._id);
      const rubric = await rubricsCollection.findOne({ _id: rubricId });
      if (!rubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.delete.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // delete rubric products
      const removedShopProductsResult = await shopProductsCollection.deleteMany({
        rubricId,
      });
      const removedFacetsResult = await productFacetsCollection.deleteMany({
        rubricId,
      });
      const removedSummariesResult = await productSummariesCollection.deleteMany({
        rubricId,
      });
      if (
        !removedFacetsResult.acknowledged ||
        !removedSummariesResult.acknowledged ||
        !removedShopProductsResult.acknowledged
      ) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.deleteProduct.error'),
        };
        await session.abortTransaction();
        return;
      }

      // delete categories
      await categoriesCollection.deleteMany({
        rubricId: rubric._id,
      });

      // delete rubric
      const removedRubricsResult = await rubricsCollection.deleteOne({
        _id: rubricId,
      });
      if (!removedRubricsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('rubrics.delete.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('deleteRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
