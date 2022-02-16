import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { GiftCertificatePayloadModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
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
    const collections = await getDbCollections();
    const giftCertificatesCollection = collections.giftCertificatesCollection();

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
