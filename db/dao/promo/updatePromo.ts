import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updatePromoSchema } from 'validation/promoSchema';
import { DateModel, PromoPayloadModel, TranslationModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdatePromoInputInterface {
  _id: string;
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  titleI18n: TranslationModel;

  // discount
  discountPercent: number;
  addCategoryDiscount: boolean;
  useBiggestDiscount: boolean;

  // cashback
  cashbackPercent: number;
  addCategoryCashback: boolean;
  useBiggestCashback: boolean;
  allowPayFromCashback: boolean;

  // ui configs
  showAsPromoPage: boolean;
  content: string;

  // main banner
  showAsMainBanner: boolean;
  mainBannerTextColor: string;
  mainBannerVerticalTextAlign: string;
  mainBannerHorizontalTextAlign: string;
  mainBannerTextAlign: string;
  mainBannerTextPadding: number;
  mainBannerTextMaxWidth: number;

  //secondary banner
  showAsSecondaryBanner: boolean;
  secondaryBannerTextColor: string;
  secondaryBannerVerticalTextAlign: string;
  secondaryBannerHorizontalTextAlign: string;
  secondaryBannerTextAlign: string;
  secondaryBannerTextPadding: number;
  secondaryBannerTextMaxWidth: number;

  // dates
  startAt: DateModel;
  endAt: DateModel;
}

export async function updatePromo({
  context,
  input,
}: DaoPropsInterface<UpdatePromoInputInterface>): Promise<PromoPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const promoCollection = collections.promoCollection();
  const promoProductsCollection = collections.promoProductsCollection();
  const promoCodesCollection = collections.promoCodesCollection();
  const session = collections.client.startSession();
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

      // update product products
      const updatedPromoProductsResult = await promoProductsCollection.updateMany(
        {
          promoId,
        },
        {
          $set: {
            discountPercent: updatedPromo.discountPercent,
            addCategoryDiscount: updatedPromo.addCategoryDiscount,
            useBiggestDiscount: updatedPromo.useBiggestDiscount,
            cashbackPercent: updatedPromo.cashbackPercent,
            addCategoryCashback: updatedPromo.addCategoryCashback,
            useBiggestCashback: updatedPromo.useBiggestCashback,
            allowPayFromCashback: updatedPromo.allowPayFromCashback,
            startAt: new Date(updatedPromo.startAt),
            endAt: new Date(updatedPromo.endAt),
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

      // update promo codes
      const updatedPromoCodesResult = await promoCodesCollection.updateMany(
        {
          promoId,
        },
        {
          $set: {
            promoSlug: updatedPromo.slug,
            promoId: updatedPromo._id,
            addCategoryCashback: updatedPromo.addCategoryCashback,
            addCategoryDiscount: updatedPromo.addCategoryDiscount,
            allowPayFromCashback: updatedPromo.allowPayFromCashback,
            cashbackPercent: updatedPromo.cashbackPercent,
            companyId: updatedPromo.companyId,
            companySlug: updatedPromo.companySlug,
            discountPercent: updatedPromo.discountPercent,
            useBiggestCashback: updatedPromo.useBiggestCashback,
            useBiggestDiscount: updatedPromo.useBiggestDiscount,
            startAt: updatedPromo.startAt,
            endAt: updatedPromo.endAt,
          },
        },
      );
      if (!updatedPromoCodesResult.acknowledged) {
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
    console.log('updatePromo error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
