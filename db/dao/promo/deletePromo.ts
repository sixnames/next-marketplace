import { PromoPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { deleteUpload } from 'lib/assetUtils/assetUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeletePromoInputInterface {
  _id: string;
}

export async function deletePromo({
  context,
  input,
}: DaoPropsInterface<DeletePromoInputInterface>): Promise<PromoPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const promoCollection = collections.promoCollection();
  const promoProductsCollection = collections.promoProductsCollection();
  const promoCodesCollection = collections.promoCodesCollection();
  const session = collections.client.startSession();
  let mutationPayload: PromoPayloadModel = {
    success: false,
    message: await getApiMessage('promo.delete.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'deletePromo',
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
          message: await getApiMessage('promo.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      // check availability
      const _id = new ObjectId(input._id);
      const promo = await promoCollection.findOne({ _id });
      if (!promo) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promo.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      // delete assets from cloud
      for await (const filePath of promo.assetKeys) {
        await deleteUpload(filePath);
      }

      // delete promo products
      const removedPromoProductsResult = await promoProductsCollection.deleteMany({
        promoId: promo._id,
      });
      const removedPromoCodesResult = await promoCodesCollection.deleteMany({
        promoId: promo._id,
      });
      if (!removedPromoProductsResult.acknowledged || !removedPromoCodesResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promo.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      // delete
      const removedPromoResult = await promoCollection.findOneAndDelete({ _id });
      if (!removedPromoResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promo.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('promo.delete.success'),
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
}
