import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { COL_BRANDS } from 'db/collectionNames';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import {
  BrandBaseModel,
  BrandModel,
  BrandPayloadModel,
  TranslationModel,
  URLModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextNumberItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { createBrandSchema } from 'validation/brandSchema';

export interface CreateBrandInputInterface extends BrandBaseModel {
  url?: URLModel[] | null;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
}

export async function createBrand({
  context,
  input,
}: DaoPropsInterface<CreateBrandInputInterface>): Promise<BrandPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const brandsCollection = db.collection<BrandModel>(COL_BRANDS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createBrand',
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
        message: await getApiMessage('brands.create.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createBrandSchema,
    });
    await validationSchema.validate(input);

    // check if already exist
    const exist = await findDocumentByI18nField<BrandModel>({
      collectionName: COL_BRANDS,
      fieldName: 'nameI18n',
      fieldArg: input.nameI18n,
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('brands.create.duplicate'),
      };
    }

    // create
    const itemId = await getNextNumberItemId(COL_BRANDS);
    const createdBrandResult = await brandsCollection.insertOne({
      ...input,
      url: (input.url || []).map((link) => {
        return `${link}`;
      }),
      itemId,
      ...DEFAULT_COUNTERS_OBJECT,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!createdBrandResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('brands.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('brands.create.success'),
    };
  } catch (e) {
    console.log('createBrand error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
