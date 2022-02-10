import { COL_BRANDS } from 'db/collectionNames';
import { AlphabetListModelType, BrandModel, PayloadType } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { BrandInterface, DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getAlphabetList } from 'lib/optionUtils';
import { getRequestParams } from 'lib/sessionHelpers';

export interface GetBrandAlphabetListsInputInterface {
  slugs: string[];
}

export type BrandAlphabetListsPayloadModel = PayloadType<AlphabetListModelType<BrandInterface>[]>;

export async function getBrandAlphabetLists({
  context,
  input,
}: DaoPropsInterface<GetBrandAlphabetListsInputInterface>): Promise<BrandAlphabetListsPayloadModel> {
  try {
    const { locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const brandsCollection = db.collection<BrandModel>(COL_BRANDS);

    // check input
    if (!input) {
      return {
        success: false,
        message: 'no input',
      };
    }

    let query: Record<string, any> = {};
    if (input.slugs.length > 0) {
      query = {
        slug: {
          $in: input.slugs,
        },
      };
    }

    const brands = await brandsCollection
      .find(query, {
        projection: {
          _id: true,
          itemId: true,
          nameI18n: true,
        },
      })
      .toArray();
    const payload = getAlphabetList<BrandModel>({
      entityList: brands,
      locale,
    });

    return {
      success: true,
      message: 'success',
      payload,
    };
  } catch (e) {
    console.log('getBrandAlphabetLists error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
