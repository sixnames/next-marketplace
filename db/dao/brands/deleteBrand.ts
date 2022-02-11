import { COL_BRANDS, COL_PRODUCT_FACETS } from 'db/collectionNames';
import { BrandModel, BrandPayloadModel, ProductFacetModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteBrandInputInterface {
  _id: string;
}

export async function deleteBrand({
  context,
  input,
}: DaoPropsInterface<DeleteBrandInputInterface>): Promise<BrandPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
    const productsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'deleteBrand',
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
        message: await getApiMessage('brands.update.error'),
      };
    }

    // get brand
    const brand = await brandsCollection.findOne({ _id: new ObjectId(input._id) });
    if (!brand) {
      return {
        success: false,
        message: await getApiMessage('brands.delete.notFound'),
      };
    }

    // check if used
    const used = await productsCollection.findOne({ brandSlug: brand.itemId });
    if (used) {
      return {
        success: false,
        message: await getApiMessage('brands.delete.used'),
      };
    }

    // delete
    const removedBrandResult = await brandsCollection.findOneAndDelete({ _id: brand._id });
    if (!removedBrandResult.ok) {
      return {
        success: false,
        message: await getApiMessage('brands.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('brands.delete.success'),
    };
  } catch (e) {
    console.log('deleteBrand error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
