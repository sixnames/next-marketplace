import { COL_BRAND_COLLECTIONS } from 'db/collectionNames';
import { AlphabetListModelType, BrandCollectionModel, PayloadType } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { BrandCollectionInterface, DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getAlphabetList } from 'lib/optionUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface GetBrandCollectionAlphabetListsInputInterface {
  brandId?: string | null;
  brandSlug?: string | null;
  slugs: string[];
}

export type BrandCollectionAlphabetListsPayloadModel = PayloadType<
  AlphabetListModelType<BrandCollectionInterface>[]
>;

export async function getBrandCollectionAlphabetLists({
  context,
  input,
}: DaoPropsInterface<GetBrandCollectionAlphabetListsInputInterface>): Promise<BrandCollectionAlphabetListsPayloadModel> {
  try {
    const { locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);

    // check input
    if (!input) {
      return {
        success: false,
        message: 'no input',
      };
    }

    let query: Record<string, any> = {};
    if (input) {
      if (input.brandId) {
        query = {
          brandId: new ObjectId(input.brandId),
        };
      }

      if (input.brandSlug) {
        query = {
          brandSlug: input.brandSlug,
        };
      }
      if (input.slugs) {
        query = {
          slug: {
            $in: input.slugs,
          },
        };
      }
    }

    const brandCollections = await brandCollectionsCollection
      .find(query, {
        projection: {
          _id: true,
          itemId: true,
          nameI18n: true,
        },
      })
      .toArray();
    const payload = getAlphabetList<BrandCollectionModel>({
      entityList: brandCollections,
      locale,
    });

    return {
      success: true,
      message: 'success',
      payload,
    };
  } catch (e) {
    console.log('getBrandCollectionAlphabetLists error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
