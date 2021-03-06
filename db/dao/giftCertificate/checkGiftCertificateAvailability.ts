import { GiftCertificatePayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updateCartGiftCertificate } from '../cart/updateCartGiftCertificate';

export interface CheckGiftCertificateAvailabilityInputInterface {
  code: string;
  companyId: string;
  userId?: string | null;
  cartId?: string | null;
}

export async function checkGiftCertificateAvailability({
  input,
  context,
}: DaoPropsInterface<CheckGiftCertificateAvailabilityInputInterface>): Promise<GiftCertificatePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const giftCertificatesCollection = collections.giftCertificatesCollection();

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.check.error'),
      };
    }

    // get certificate
    const giftCertificate = await giftCertificatesCollection.findOne({
      companyId: new ObjectId(input.companyId),
      code: input.code,
    });
    if (!giftCertificate) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.check.notFound'),
      };
    }

    // if user is unauthenticated
    if (!input.userId) {
      if (giftCertificate.userId) {
        return {
          success: true,
          notAuth: true,
          message: await getApiMessage('giftCertificate.check.notAuth'),
        };
      }

      if (input.cartId) {
        await updateCartGiftCertificate({
          cartId: new ObjectId(input.cartId),
          giftCertificateId: giftCertificate._id,
        });
      }
      return {
        success: true,
        message: await getApiMessage('giftCertificate.check.success'),
        payload: giftCertificate,
      };
    }

    const userId = new ObjectId(input.userId);

    // if new certificate
    if (!giftCertificate.userId) {
      // update
      const updatedGiftCertificateResult = await giftCertificatesCollection.findOneAndUpdate(
        {
          _id: giftCertificate._id,
        },
        {
          $set: {
            userId,
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
          message: await getApiMessage('giftCertificate.check.error'),
        };
      }

      if (input.cartId) {
        await updateCartGiftCertificate({
          cartId: new ObjectId(input.cartId),
          giftCertificateId: giftCertificate._id,
        });
      }
      return {
        success: true,
        message: await getApiMessage('giftCertificate.check.success'),
        payload: updatedGiftCertificate,
      };
    }

    // check if user is owner of certificate
    if (!giftCertificate.userId.equals(userId)) {
      return {
        success: false,
        message: await getApiMessage('giftCertificate.check.notFound'),
      };
    }

    if (input.cartId) {
      await updateCartGiftCertificate({
        cartId: new ObjectId(input.cartId),
        giftCertificateId: giftCertificate._id,
      });
    }
    return {
      success: true,
      message: await getApiMessage('giftCertificate.check.success'),
      payload: giftCertificate,
    };
  } catch (e) {
    console.log('checkGiftCertificateAvailability error ', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
