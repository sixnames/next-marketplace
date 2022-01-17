import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_PROMO_CODES } from '../../collectionNames';
import { PromoCodeModel, PromoCodePayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface DeletePromoCodeInputInterface {
  _id: string;
}

export async function deletePromoCode({
  context,
  input,
}: DaoPropsInterface<DeletePromoCodeInputInterface>): Promise<PromoCodePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'deletePromoCode',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('promoCode.delete.error'),
      };
    }

    // delete promo code
    const promoCodesCollection = db.collection<PromoCodeModel>(COL_PROMO_CODES);
    const createdPromoCodeResult = await promoCodesCollection.findOneAndDelete({
      _id: new ObjectId(input._id),
    });
    if (!createdPromoCodeResult.ok) {
      return {
        success: true,
        message: await getApiMessage('promoCode.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('promoCode.delete.success'),
    };
  } catch (e) {
    console.log('createPromoCode error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
