import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from '../../../lib/sessionHelpers';
import { updatePromoCodeSchema } from '../../../validation/promoSchema';
import { COL_PROMO_CODES } from '../../collectionNames';
import { PromoCodeModel, PromoCodePayloadModel, TranslationModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdatePromoCodeInputInterface {
  _id: string;
  code: string;
  descriptionI18n?: TranslationModel | null;
}

export async function updatePromoCode({
  context,
  input,
}: DaoPropsInterface<UpdatePromoCodeInputInterface>): Promise<PromoCodePayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const promoCodesCollection = db.collection<PromoCodeModel>(COL_PROMO_CODES);
  const session = client.startSession();
  let mutationPayload: PromoCodePayloadModel = {
    success: false,
    message: await getApiMessage('promo.update.error'),
  };
  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updatePromoCode',
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
          message: await getApiMessage('promoCode.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: updatePromoCodeSchema,
      });
      await validationSchema.validate(input);

      // check availability
      const promoCode = await promoCodesCollection.findOne({
        _id: new ObjectId(input._id),
      });
      if (!promoCode) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promoCode.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      // check code intersects
      const exist = await promoCodesCollection.findOne({
        promoId: promoCode.promoId,
        code: input.code,
      });
      if (exist) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promoCode.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      // update
      const updatePromoCodeResult = await promoCodesCollection.findOneAndUpdate(
        {
          _id: promoCode._id,
        },
        {
          $set: {
            code: input.code,
            descriptionI18n: input.descriptionI18n,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatePromoCode = updatePromoCodeResult.value;
      if (!updatePromoCodeResult.ok || !updatePromoCode) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('promoCode.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('promoCode.create.success'),
        payload: updatePromoCode,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('createPromoCode error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
