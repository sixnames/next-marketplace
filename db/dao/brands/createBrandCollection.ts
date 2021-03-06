import { COL_BRAND_COLLECTIONS } from 'db/collectionNames';
import {
  BrandBaseModel,
  BrandCollectionPayloadModel,
  BrandModel,
  TranslationModel,
} from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';

import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import { DEFAULT_COUNTERS_OBJECT } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextNumberItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { createBrandCollectionSchema } from 'validation/brandSchema';

export interface CreateBrandCollectionInputInterface extends BrandBaseModel {
  brandId: string;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
}

export async function createBrandCollection({
  context,
  input,
}: DaoPropsInterface<CreateBrandCollectionInputInterface>): Promise<BrandCollectionPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const brandsCollection = collections.brandsCollection();
    const brandsCollectionsCollection = collections.brandCollectionsCollection();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createBrandCollection',
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
        message: await getApiMessage('brandCollections.create.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createBrandCollectionSchema,
    });
    await validationSchema.validate(input);
    const { brandId, ...values } = input;

    // get brand
    const brand = await brandsCollection.findOne({ _id: new ObjectId(brandId) });
    if (!brand) {
      return {
        success: false,
        message: await getApiMessage('brands.update.notFound'),
      };
    }

    // check if brand collection already exist in brand
    const exist = await findDocumentByI18nField<BrandModel>({
      collectionName: COL_BRAND_COLLECTIONS,
      fieldName: 'nameI18n',
      fieldArg: values.nameI18n,
      additionalQuery: {
        brandId: brand._id,
      },
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('brandCollections.create.duplicate'),
      };
    }

    // create
    const itemId = await getNextNumberItemId(COL_BRAND_COLLECTIONS);
    const createdBrandCollectionResult = await brandsCollectionsCollection.insertOne({
      ...values,
      _id: new ObjectId(),
      itemId,
      brandId: brand._id,
      brandSlug: brand.itemId,
      ...DEFAULT_COUNTERS_OBJECT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!createdBrandCollectionResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('brandCollections.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('brandCollections.create.success'),
    };
  } catch (e) {
    console.log('createBrandCollection error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
