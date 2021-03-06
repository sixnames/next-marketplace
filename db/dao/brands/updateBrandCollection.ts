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
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { ObjectId } from 'mongodb';
import { updateCollectionInBrandSchema } from 'validation/brandSchema';

export interface UpdateBrandCollectionInputInterface extends BrandBaseModel {
  _id: string;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
}

export async function updateBrandCollection({
  context,
  input,
}: DaoPropsInterface<UpdateBrandCollectionInputInterface>): Promise<BrandCollectionPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const brandCollectionsCollection = collections.brandCollectionsCollection();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateBrandCollection',
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
        message: await getApiMessage('brandCollections.update.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updateCollectionInBrandSchema,
    });
    await validationSchema.validate(input);

    const { _id, ...values } = input;

    // get brand collection
    const brandCollection = await brandCollectionsCollection.findOne({
      _id: new ObjectId(_id),
    });
    if (!brandCollection) {
      return {
        success: false,
        message: await getApiMessage('brandCollections.update.notFound'),
      };
    }

    // Check if brand collection name already exist in brand
    const exist = await findDocumentByI18nField<BrandModel>({
      collectionName: COL_BRAND_COLLECTIONS,
      fieldName: 'nameI18n',
      fieldArg: values.nameI18n,
      additionalQuery: {
        $and: [
          {
            brandId: brandCollection.brandId,
          },
          {
            _id: {
              $ne: brandCollection._id,
            },
          },
        ],
      },
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('brandCollections.update.duplicate'),
      };
    }

    // Update brand collection
    const updatedBrandCollectionResult = await brandCollectionsCollection.findOneAndUpdate(
      {
        _id: brandCollection._id,
      },
      {
        $set: {
          ...values,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedBrandCollection = updatedBrandCollectionResult.value;
    if (!updatedBrandCollectionResult.ok || !updatedBrandCollection) {
      return {
        success: false,
        message: await getApiMessage('brandCollections.update.error'),
      };
    }

    // update product algolia indexes
    execUpdateProductTitles(`brandCollectionSlug=${updatedBrandCollection.itemId}`);
    return {
      success: true,
      message: await getApiMessage('brandCollections.update.success'),
    };
  } catch (e) {
    console.log('updateBrandCollection error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
