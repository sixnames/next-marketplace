import { COL_PROMO } from 'db/collectionNames';
import { DateModel, PromoPayloadModel, TranslationModel } from 'db/dbModels';

import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import {
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  TEXT_HORIZONTAL_ALIGN_OPTIONS,
  TEXT_HORIZONTAL_FLEX_OPTIONS,
  TEXT_VERTICAL_FLEX_OPTIONS,
} from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { createPromoSchema } from 'validation/promoSchema';

export interface CreatePromoInputInterface {
  nameI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  companyId: string;
  companySlug: string;
  discountPercent: number;
  cashbackPercent: number;
  startAt?: DateModel | null;
  endAt?: DateModel | null;
}

export async function createPromo({
  context,
  input,
}: DaoPropsInterface<CreatePromoInputInterface>): Promise<PromoPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createPromo',
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
        message: await getApiMessage('promo.create.error'),
      };
    }
    // check input dates
    if (!input.startAt || !input.endAt) {
      return {
        success: false,
        message: await getApiMessage('validation.promo.datesError'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createPromoSchema,
    });
    await validationSchema.validate(input);

    const promoCollection = collections.promoCollection();

    // create
    const createdPromoResult = await promoCollection.insertOne({
      slug: await getNextItemId(COL_PROMO),
      companyId: new ObjectId(input.companyId),
      companySlug: input.companySlug,
      nameI18n: input.nameI18n,
      descriptionI18n: input.descriptionI18n,

      // discount
      discountPercent: input.discountPercent,
      addCategoryDiscount: false,
      useBiggestDiscount: false,

      // cashback
      cashbackPercent: input.cashbackPercent,
      addCategoryCashback: false,
      useBiggestCashback: false,
      allowPayFromCashback: false,

      // ui configs
      showAsPromoPage: false,
      assetKeys: [],
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,

      // main banner
      showAsMainBanner: false,
      mainBannerTextColor: '#000000',
      mainBannerVerticalTextAlign: TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
      mainBannerHorizontalTextAlign: TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
      mainBannerTextAlign: TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
      mainBannerTextPadding: 1,
      mainBannerTextMaxWidth: 20,

      //secondary banner
      showAsSecondaryBanner: false,
      secondaryBannerTextColor: '#000000',
      secondaryBannerVerticalTextAlign: TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
      secondaryBannerHorizontalTextAlign: TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
      secondaryBannerTextAlign: TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
      secondaryBannerTextPadding: 1,
      secondaryBannerTextMaxWidth: 10,

      // dates
      createdAt: new Date(),
      updatedAt: new Date(),
      startAt: new Date(input.startAt),
      endAt: new Date(input.endAt),
    });
    if (!createdPromoResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('promo.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('promo.create.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
