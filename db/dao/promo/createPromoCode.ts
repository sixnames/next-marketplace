import { PromoCodePayloadModel, TranslationModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import trim from 'trim';
import { createPromoCodeSchema } from 'validation/promoSchema';

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
    const collections = await getDbCollections();

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
    const promoCollection = collections.promoCollection();
    const promo = await promoCollection.findOne({
      _id: new ObjectId(input.promoId),
    });
    if (!promo) {
      return {
        success: true,
        message: await getApiMessage('promoCode.create.error'),
      };
    }

    // check code intersects
    const promoCodesCollection = collections.promoCodesCollection();
    const exist = await promoCodesCollection.findOne({
      promoId: promo._id,
      code: input.code,
    });
    if (exist) {
      return {
        success: true,
        message: await getApiMessage('promoCode.create.error'),
      };
    }

    // create promo code
    const createdPromoCodeResult = await promoCodesCollection.insertOne({
      code: trim(input.code),
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
