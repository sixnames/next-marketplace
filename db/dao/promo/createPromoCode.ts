import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { createPromoCodeSchema } from '../../../validation/promoSchema';
import { COL_PROMO, COL_PROMO_CODES } from '../../collectionNames';
import {
  PromoCodeModel,
  PromoCodePayloadModel,
  PromoModel,
  TranslationModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface CreatePromoCodeInputInterface {
  promoId: string;
  code: string;
  descriptionI18n?: TranslationModel | null;
}

export async function createPromoCode({
  context,
  input,
}: DaoPropsInterface<CreatePromoCodeInputInterface>): Promise<PromoCodePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createPromoCode',
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
        message: await getApiMessage('promoCode.create.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createPromoCodeSchema,
    });
    await validationSchema.validate(input);

    // get promo
    const promoCollection = db.collection<PromoModel>(COL_PROMO);
    const promo = await promoCollection.findOne({
      _id: new ObjectId(input.promoId),
    });
    if (!promo) {
      return {
        success: true,
        message: await getApiMessage('promoCode.create.success'),
      };
    }

    // create promo code
    const promoCodesCollection = db.collection<PromoCodeModel>(COL_PROMO_CODES);
    const createdPromoCodeResult = await promoCodesCollection.insertOne({
      code: input.code,
      descriptionI18n: input.descriptionI18n,
      active: true,
      paybackPercent: 0,
      promoSlug: promo.slug,
      promoId: promo._id,
      addCategoryCashback: promo.addCategoryCashback,
      addCategoryDiscount: promo.addCategoryDiscount,
      allowPayFromCashback: promo.allowPayFromCashback,
      cashbackPercent: promo.cashbackPercent,
      companyId: promo.companyId,
      companySlug: promo.companySlug,
      discountPercent: promo.discountPercent,
      useBiggestCashback: promo.useBiggestCashback,
      useBiggestDiscount: promo.useBiggestDiscount,
      startAt: promo.startAt,
      endAt: promo.endAt,
    });
    const createdPromoCode = await promoCodesCollection.findOne({
      _id: createdPromoCodeResult.insertedId,
    });
    if (!createdPromoCodeResult.acknowledged || !createdPromoCode) {
      return {
        success: false,
        message: await getApiMessage('promoCode.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('promoCode.create.success'),
      payload: createdPromoCode,
    };
  } catch (e) {
    console.log('createPromoCode error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
