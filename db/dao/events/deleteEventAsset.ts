import { deleteUpload, getMainImage } from 'lib/assetUtils/assetUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ProductPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';

export interface DeleteEventAssetInputInterface {
  eventId: string;
  assetIndex: number;
  taskId?: string | null;
}

export async function deleteEventAsset({
  input,
  context,
}: DaoPropsInterface<DeleteEventAssetInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const eventSummariesCollection = collections.eventSummariesCollection();

  const session = collections.client.startSession();

  let mutationPayload: ProductPayloadModel = {
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
        slug: 'updateEventAssets',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      const { assetIndex } = input;

      // get summary
      const summary = await eventSummariesCollection.findOne({
        _id: new ObjectId(input.eventId),
      });
      if (!summary) {
        await session.abortTransaction();
        return;
      }
      const updatedSummary = { ...summary };

      // update assets
      let assetUrl: string = '';
      const updatedAssets = updatedSummary.assets.reduce((acc: string[], asset, index) => {
        if (index === assetIndex) {
          assetUrl = asset;
          return acc;
        }
        return [...acc, asset];
      }, []);
      updatedSummary.assets = updatedAssets;
      updatedSummary.mainImage = getMainImage(updatedAssets);

      // delete local file
      if (assetUrl) {
        const removedAsset = await deleteUpload(assetUrl);
        if (!removedAsset) {
          mutationPayload = {
            success: false,
            message: await getApiMessage(`events.update.error`),
          };
          await session.abortTransaction();
          return;
        }
      }

      // update documents
      const updatedProductAssetsResult = await eventSummariesCollection.findOneAndUpdate(
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
      if (!updatedProductAssetsResult.ok) {
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
    console.log('deleteEventAsset error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
