import { COL_PROMO, COL_PROMO_PRODUCTS } from 'db/collectionNames';
import {
  DateModel,
  PromoModel,
  PromoPayloadModel,
  PromoProductModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updatePromoSchema } from 'validation/promoSchema';

export interface UpdatePromoInputInterface {
  _id: string;
  discountPercent: number;
  cashbackPercent: number;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
  content: string;
  showAsMainBanner?: boolean | null;
  mainBannerTextColor?: string | null;
  mainBannerVerticalTextAlign?: string | null;
  mainBannerHorizontalTextAlign?: string | null;
  mainBannerTextAlign?: string | null;
  mainBannerTextPadding?: number | null;
  mainBannerTextMaxWidth?: number | null;
  showAsSecondaryBanner?: boolean | null;
  secondaryBannerTextColor?: string | null;
  secondaryBannerVerticalTextAlign?: string | null;
  secondaryBannerHorizontalTextAlign?: string | null;
  secondaryBannerTextAlign?: string | null;
  secondaryBannerTextPadding?: number | null;
  secondaryBannerTextMaxWidth?: number | null;
  startAt: DateModel;
  endAt: DateModel;
}

export async function updatePromo({
  context,
  input,
}: DaoPropsInterface<UpdatePromoInputInterface>): Promise<PromoPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const promoCollection = db.collection<PromoModel>(COL_PROMO);
  const promoProductsCollection = db.collection<PromoProductModel>(COL_PROMO_PRODUCTS);
  const session = client.startSession();
  let mutationPayload: PromoPayloadModel = {
    success: false,
    message: await getApiMessage('promo.update.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updatePromo',
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
          message: await getApiMessage('promo.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: updatePromoSchema,
      });
      await validationSchema.validate(input);

      const { _id, ...values } = input;
      const promoId = new ObjectId(_id);

      // check availability
      const promo = await promoCollection.findOne({ _id: promoId });
      if (!promo) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promo.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // update product dates
      const updatedPromoProductsResult = await promoProductsCollection.updateMany(
        {
          promoId,
        },
        {
          $set: {
            startAt: new Date(input.startAt),
            endAt: new Date(input.endAt),
          },
        },
      );
      if (!updatedPromoProductsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promo.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // update
      const updatedPromoResult = await promoCollection.findOneAndUpdate(
        { _id: promoId },
        {
          $set: {
            ...values,
            updatedAt: new Date(),
            startAt: new Date(input.startAt),
            endAt: new Date(input.endAt),
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedPromo = updatedPromoResult.value;
      if (!updatedPromoResult.ok || !updatedPromo) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promo.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('promo.update.success'),
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
