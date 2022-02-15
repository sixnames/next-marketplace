import { getMainImage, reorderAssets } from 'lib/assetUtils/assetUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { EventPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';

export interface UpdateEventAssetIndexInputInterface {
  taskId?: string | null;
  eventId: string;
  assetUrl: string;
  assetNewIndex: number;
}

export async function updateEventAssetIndex({
  context,
  input,
}: DaoPropsInterface<UpdateEventAssetIndexInputInterface>): Promise<EventPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const eventSummariesCollection = collections.eventSummariesCollection();

  const session = collections.client.startSession();

  let mutationPayload: EventPayloadModel = {
    success: false,
    message: await getApiMessage(`events.update.error`),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateProductAssets',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }
      const { assetNewIndex, assetUrl } = input;

      // get summary
      const summary = await eventSummariesCollection.findOne({
        _id: new ObjectId(input.eventId),
      });
      if (!summary) {
        await session.abortTransaction();
        return;
      }
      const updatedSummary = { ...summary };

      // reorder assets
      const initialAssets = updatedSummary.assets;
      const reorderedAssets = reorderAssets({
        assetUrl,
        assetNewIndex,
        initialAssets,
      });
      if (!reorderedAssets) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`events.update.error`),
        };
        await session.abortTransaction();
        return;
      }
      updatedSummary.assets = reorderedAssets;
      updatedSummary.mainImage = getMainImage(reorderedAssets);

      // update documents
      const updatedAssetsResult = await eventSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            assets: updatedSummary.assets,
            mainImage: updatedSummary.mainImage,
          },
        },
      );
      if (!updatedAssetsResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('events.update.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateEventAssetIndex error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
