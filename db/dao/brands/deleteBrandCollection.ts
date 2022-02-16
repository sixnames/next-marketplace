import { BrandCollectionPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteBrandCollectionInputInterface {
  _id: string;
}

export async function deleteBrandCollection({
  context,
  input,
}: DaoPropsInterface<DeleteBrandCollectionInputInterface>): Promise<BrandCollectionPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const brandsCollectionsCollection = collections.brandCollectionsCollection();
    const productFacetsCollection = collections.productFacetsCollection();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'deleteBrandCollection',
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
        message: await getApiMessage('brandCollections.delete.error'),
      };
    }

    // get brand collection
    const brandCollection = await brandsCollectionsCollection.findOne({
      _id: new ObjectId(input._id),
    });
    if (!brandCollection) {
      return {
        success: false,
        message: await getApiMessage('brandCollections.delete.notFound'),
      };
    }

    // check if brand collection is used in products
    const used = await productFacetsCollection.findOne({
      brandCollectionSlug: brandCollection.itemId,
    });
    if (used) {
      return {
        success: false,
        message: await getApiMessage('brandCollections.delete.used'),
      };
    }

    // delete
    const removedBrandCollectionResult = await brandsCollectionsCollection.findOneAndDelete({
      _id: brandCollection._id,
    });
    if (!removedBrandCollectionResult.ok) {
      return {
        success: false,
        message: await getApiMessage('brandCollections.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('brandCollections.delete.success'),
    };
  } catch (e) {
    console.log('deleteBrandCollection error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
