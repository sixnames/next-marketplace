import { AlphabetListModelType, BrandModel, PayloadType } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { BrandInterface, DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getAlphabetList } from 'lib/optionUtils';
import { getRequestParams } from 'lib/sessionHelpers';

export interface GetBrandAlphabetListsInputInterface {
  slugs?: string[];
}

export type BrandAlphabetModel = AlphabetListModelType<BrandInterface>;
export type BrandAlphabetListsPayloadModel = PayloadType<BrandAlphabetModel[]>;

export async function getBrandAlphabetLists({
  context,
  input,
}: DaoPropsInterface<GetBrandAlphabetListsInputInterface>): Promise<BrandAlphabetListsPayloadModel> {
  try {
    const { locale } = await getRequestParams(context);
    const collections = await getDbCollections();
    const brandsCollection = collections.brandsCollection();

    let query: Record<string, any> = {};
    if ((input?.slugs || []).length > 0) {
      query = {
        slug: {
          $in: input?.slugs,
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
