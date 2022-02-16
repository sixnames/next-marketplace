import { EventPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { NextContextInterface } from 'db/uiInterfaces';
import { getMainImage, storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_EVENTS } from 'lib/config/common';
import { parseApiFormData } from 'lib/restApi';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface AddEventAssetInterface {
  eventId: string;
  taskId?: string | null;
}

export async function addEventAsset(context: NextContextInterface): Promise<EventPayloadModel> {
  const collections = await getDbCollections();
  const eventSummariesCollection = collections.eventSummariesCollection();
  const { getApiMessage } = await getRequestParams(context);

  const session = collections.client.startSession();

  let mutationPayload: EventPayloadModel = {
    success: false,
    message: await getApiMessage('events.update.error'),
  };

  try {
    await session.withTransaction(async () => {
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

      // check input
      const formData = await parseApiFormData<AddEventAssetInterface>(context.req);
      if (!formData || !formData.files || !formData.fields) {
        await session.abortTransaction();
        return;
      }

      // get summary
      const summary = await eventSummariesCollection.findOne({
        _id: new ObjectId(formData.fields.eventId),
      });
      if (!summary) {
        await session.abortTransaction();
        return;
      }
      const updatedSummary = { ...summary };

      // upload assets
      const initialAssets = updatedSummary.assets;
      const assets = await storeUploads({
        files: formData.files,
        dist: ASSETS_DIST_EVENTS,
        dirName: summary.itemId,
      });
      if (!assets) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.update.error'),
        };
        await session.abortTransaction();
        return;
      }
      const finalAssets = [...initialAssets, ...assets];
      updatedSummary.assets = finalAssets;
      updatedSummary.mainImage = getMainImage(finalAssets);

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
      return;
    });

    return mutationPayload;
  } catch (e) {
    console.log('addEventAsset error', e);
    return mutationPayload;
  } finally {
    await session.endSession();
  }
}
