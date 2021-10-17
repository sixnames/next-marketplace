import { COL_PROMO } from 'db/collectionNames';
import { DateModel, PromoModel, PromoPayloadModel, TranslationModel } from 'db/dbModels';
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
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updatePromo',
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
        message: await getApiMessage('promo.update.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updatePromoSchema,
    });
    await validationSchema.validate(input);

    const { _id, ...values } = input;
    const promoId = new ObjectId(_id);
    const promoCollection = db.collection<PromoModel>(COL_PROMO);

    // check availability
    const promo = await promoCollection.findOne({ _id: promoId });
    if (!promo) {
      return {
        success: false,
        message: await getApiMessage('promo.update.error'),
      };
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
      return {
        success: false,
        message: await getApiMessage('promo.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('promo.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
