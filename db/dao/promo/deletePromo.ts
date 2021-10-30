import { COL_PROMO, COL_PROMO_PRODUCTS } from 'db/collectionNames';
import { PromoModel, PromoPayloadModel, PromoProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
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
  const { db, client } = await getDatabase();
  const promoCollection = db.collection<PromoModel>(COL_PROMO);
  const promoProductsCollection = db.collection<PromoProductModel>(COL_PROMO_PRODUCTS);
  const session = client.startSession();
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
      if (!removedPromoProductsResult.acknowledged) {
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
