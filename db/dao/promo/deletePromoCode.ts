import { PromoCodePayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeletePromoCodeInputInterface {
  _id: string;
}

export async function deletePromoCode({
  context,
  input,
}: DaoPropsInterface<DeletePromoCodeInputInterface>): Promise<PromoCodePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();

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
    const promoCodesCollection = collections.promoCodesCollection();
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
