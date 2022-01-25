import { ObjectId } from 'mongodb';
import trim from 'trim';
import { DEFAULT_CITY, DEFAULT_LOCALE } from '../../../config/common';
import { sendGiftCertificateEmail } from '../../../lib/email/sendGiftCertificateEmail';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_GIFT_CERTIFICATES, COL_USERS } from '../../collectionNames';
import { GiftCertificateModel, GiftCertificatePayloadModel, UserModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';
import { CreateGiftCertificateInputInterface } from './createGiftCertificate';

export interface UpdateGiftCertificateInputInterface extends CreateGiftCertificateInputInterface {
  _id: string;
  userId?: string | null;
}

export async function updateGiftCertificate({
  input,
  context,
}: DaoPropsInterface<UpdateGiftCertificateInputInterface>): Promise<GiftCertificatePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const giftCertificatesCollection = db.collection<GiftCertificateModel>(COL_GIFT_CERTIFICATES);
    const usersCollection = db.collection<UserModel>(COL_USERS);

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

    // check availability
    const giftCertificate = await giftCertificatesCollection.findOne({
      _id: new ObjectId(input._id),
    });
    if (!giftCertificate) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.update.error'),
      };
    }

    // check if exist
    const exist = await giftCertificatesCollection.findOne({
      companyId: new ObjectId(input.companyId),
      code: trim(input.code),
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
          code: trim(input.code),
          nameI18n: input.nameI18n,
          descriptionI18n: input.descriptionI18n,
          initialValue: input.initialValue,
          value: input.initialValue,
          companySlug: input.companySlug,
          userId: input.userId ? new ObjectId(input.userId) : null,
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

    // send user notification
    if (input.userId) {
      const userId = new ObjectId(input.userId);
      const sendNotification = !giftCertificate.userId || !userId.equals(giftCertificate.userId);
      if (sendNotification) {
        const newUser = await usersCollection.findOne({
          _id: userId,
        });
        if (newUser) {
          await sendGiftCertificateEmail({
            citySlug: DEFAULT_CITY,
            value: updatedGiftCertificate.value,
            companySiteSlug: updatedGiftCertificate.companySlug,
            locale: DEFAULT_LOCALE,
            to: newUser.email,
            userName: newUser.name,
          });
        }
      }
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
