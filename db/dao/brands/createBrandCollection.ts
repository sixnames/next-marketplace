import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { COL_BRAND_COLLECTIONS, COL_BRANDS } from 'db/collectionNames';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import {
  BrandBaseModel,
  BrandCollectionModel,
  BrandCollectionPayloadModel,
  BrandModel,
  TranslationModel,
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
import { addCollectionToBrandSchema } from 'validation/brandSchema';

export interface CreateBrandCollectionInputInterface extends BrandBaseModel {
  brandId: string;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
}

export async function createBrandCollection({
  context,
  input,
}: DaoPropsInterface<CreateBrandCollectionInputInterface>): Promise<BrandCollectionPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const brandsCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);

  const session = client.startSession();

  let mutationPayload: BrandCollectionPayloadModel = {
    success: false,
    message: await getApiMessage('brandCollections.create.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'createBrandCollection',
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
          message: await getApiMessage('brandCollections.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: addCollectionToBrandSchema,
      });
      await validationSchema.validate(input);
      const { brandId, ...values } = input;

      // get brand
      const brand = await brandsCollection.findOne({ _id: new ObjectId(brandId) });
      if (!brand) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('brands.update.notFound'),
        };
        await session.abortTransaction();
        return;
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
        mutationPayload = {
          success: false,
          message: await getApiMessage('brandCollections.create.duplicate'),
        };
        await session.abortTransaction();
        return;
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
        mutationPayload = {
          success: false,
          message: await getApiMessage('brandCollections.create.error'),
        };
        await session.abortTransaction();
        return;
      }

      // update brand
      const updatedBrandResult = await brandsCollection.findOneAndUpdate(
        {
          _id: brand._id,
        },
        {
          $push: {
            collectionsIds: createdBrandCollectionResult.insertedId,
          },
          $set: {
            updatedAt: new Date(),
          },
        },
      );
      if (!updatedBrandResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('brands.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('brandCollections.create.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('createBrandCollection error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
