import { ObjectIdModel, PayloadType } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface, PromoCodeInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import trim from 'trim';

export interface CheckPromoCodeAvailabilityPayloadInterface {
  promoCode: PromoCodeInterface;
  shopProductIds: ObjectIdModel[];
}

export type CheckPromoCodeAvailabilityPayloadModel =
  PayloadType<CheckPromoCodeAvailabilityPayloadInterface>;

export interface CheckPromoCodeAvailabilityInputInterface {
  code: string;
  shopProductIds: string[];
  companyId: string;
  cartId?: string | null;
  userId?: string | null;
}

export async function checkPromoCodeAvailability({
  input,
  context,
}: DaoPropsInterface<CheckPromoCodeAvailabilityInputInterface>): Promise<CheckPromoCodeAvailabilityPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const promoCodesCollection = collections.promoCodesCollection();
    const promoProductsCollection = collections.promoProductsCollection();
    const cartsCollection = collections.cartsCollection();

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('promoCode.check.error'),
      };
    }

    // get promo code
    const promoCode = await promoCodesCollection.findOne({
      companyId: new ObjectId(input.companyId),
      code: trim(input.code),
    });
    if (!promoCode) {
      return {
        success: false,
        message: await getApiMessage('promoCode.check.notFound'),
      };
    }

    // check if promo code is used by this user
    if (input.userId) {
      const used = (promoCode.usedByUserIds || []).some((_id) => {
        return new ObjectId(`${input.userId}`).equals(_id);
      });
      if (used) {
        return {
          success: false,
          message: await getApiMessage('promoCode.check.used'),
        };
      }
    }

    // check if promo code is expired
    if (new Date().getTime() > new Date(promoCode.endAt).getTime()) {
      return {
        success: false,
        message: await getApiMessage('promoCode.check.expired'),
      };
    }

    // get promo products
    const shopProductIds = input.shopProductIds.map((_id) => new ObjectId(_id));
    const promoProducts = await promoProductsCollection
      .find({
        promoId: promoCode.promoId,
        shopProductId: {
          $in: shopProductIds,
        },
      })
      .toArray();
    if (promoProducts.length < 1) {
      return {
        success: false,
        message: await getApiMessage('promoCode.check.noProducts'),
      };
    }

    // add user _id to the promo code
    if (input.userId) {
      await promoCodesCollection.findOneAndUpdate(
        {
          _id: promoCode._id,
        },
        {
          $addToSet: {
            usedByUserIds: new ObjectId(input.userId),
          },
        },
      );
    }

    // add promo code to the cart
    if (input.cartId) {
      await cartsCollection.findOneAndUpdate(
        {
          _id: new ObjectId(input.cartId),
        },
        {
          $addToSet: {
            promoCodeIds: promoCode._id,
          },
        },
      );
    }

    return {
      success: true,
      message: await getApiMessage('promoCode.check.success'),
      payload: {
        promoCode,
        shopProductIds: promoProducts.map(({ shopProductId }) => shopProductId),
      },
    };
  } catch (e) {
    console.log('checkPromoCodeAvailability error ', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
