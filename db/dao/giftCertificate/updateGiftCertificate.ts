import { COL_GIFT_CERTIFICATES } from 'db/collectionNames';
import { CreateGiftCertificateInputInterface } from 'db/dao/giftCertificate/createGiftCertificate';
import { GiftCertificateModel, GiftCertificatePayloadModel, ObjectIdModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface UpdateGiftCertificateInputInterface extends CreateGiftCertificateInputInterface {
  _id: string;
  userId?: ObjectIdModel | null;
}

export async function updateGiftCertificate({
  input,
  context,
}: DaoPropsInterface<UpdateGiftCertificateInputInterface>): Promise<GiftCertificatePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const giftCertificatesCollection = db.collection<GiftCertificateModel>(COL_GIFT_CERTIFICATES);

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.update.error'),
      };
    }

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateGiftCertificate',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // check if exist
    const exist = await giftCertificatesCollection.findOne({
      companyId: new ObjectId(input.companyId),
      code: input.code,
      _id: {
        $ne: new ObjectId(input._id),
      },
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.update.exist'),
      };
    }

    // update
    const updatedGiftCertificateResult = await giftCertificatesCollection.findOneAndUpdate(
      {
        _id: new ObjectId(input._id),
      },
      {
        $set: {
          log: [],
          code: input.code,
          nameI18n: input.nameI18n,
          descriptionI18n: input.descriptionI18n,
          initialValue: input.initialValue,
          value: input.initialValue,
          companySlug: input.companySlug,
          companyId: new ObjectId(input.companyId),
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedGiftCertificate = updatedGiftCertificateResult.value;
    if (!updatedGiftCertificateResult.ok || !updatedGiftCertificate) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('giftCertificate.update.success'),
      payload: updatedGiftCertificate,
    };
  } catch (e) {
    console.log('updateGiftCertificate error ', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
