import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_GIFT_CERTIFICATES } from '../../collectionNames';
import { GiftCertificateModel, GiftCertificatePayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface DeleteGiftCertificateInputInterface {
  _id: string;
}

export async function deleteGiftCertificate({
  input,
  context,
}: DaoPropsInterface<DeleteGiftCertificateInputInterface>): Promise<GiftCertificatePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const giftCertificatesCollection = db.collection<GiftCertificateModel>(COL_GIFT_CERTIFICATES);

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.delete.error'),
      };
    }

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'deleteGiftCertificate',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // create
    const removedGiftCertificateResult = await giftCertificatesCollection.findOneAndDelete({
      _id: new ObjectId(input._id),
    });
    if (!removedGiftCertificateResult.ok) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('giftCertificate.delete.success'),
    };
  } catch (e) {
    console.log('deleteGiftCertificate error ', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
