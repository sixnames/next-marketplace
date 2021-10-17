import { PAGE_EDITOR_DEFAULT_VALUE_STRING } from 'config/common';
import { COL_PROMO } from 'db/collectionNames';
import { DateModel, PromoModel, PromoPayloadModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
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
  descriptionI18n?: TranslationModel | null;
  companyId: string;
  discountPercent: number;
  cashbackPercent: number;
  startAt: DateModel;
  endAt: DateModel;
}

export async function createPromo({
  context,
  input,
}: DaoPropsInterface<CreatePromoInputInterface>): Promise<PromoPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();

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

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createPromoSchema,
    });
    await validationSchema.validate(input);

    const promoCollection = db.collection<PromoModel>(COL_PROMO);

    // create
    const createdPromoResult = await promoCollection.insertOne({
      ...input,
      slug: await getNextItemId(COL_PROMO),
      companyId: new ObjectId(input.companyId),
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      assetKeys: [],
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
