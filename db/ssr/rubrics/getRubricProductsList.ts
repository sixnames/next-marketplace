import { getConsoleRubricProducts } from 'db/ssr/rubrics/getConsoleRubricProducts';
import { ConsoleRubricProductsInterface } from 'db/uiInterfaces';
import { alwaysString } from 'lib/arrayUtils';
import { DEFAULT_COMPANY_SLUG, DEFAULT_PAGE } from 'lib/config/common';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';

export interface GetRubricProductsListInputInterface {
  rubricSlug: string;
  excludedProductsIds?: string[];
  attributesIds?: string[] | null;
  excludedOptionsSlugs?: string[] | null;
  page: number;
  search?: string | null;
  locale: string;
  currency: string;
}

export async function getRubricProductsList({
  page,
  locale,
  currency,
  excludedProductsIds,
  attributesIds,
  excludedOptionsSlugs,
  search,
  rubricSlug,
}: GetRubricProductsListInputInterface): Promise<ConsoleRubricProductsInterface | null> {
  try {
    const payload = await getConsoleRubricProducts({
      basePath: '',
      locale,
      currency,
      page: noNaN(page) || DEFAULT_PAGE,
      excludedProductsIds: (excludedProductsIds || []).map((_id) => new ObjectId(_id)),
      attributesIds: (attributesIds || []).map((_id) => new ObjectId(_id)),
      excludedOptionsSlugs: excludedOptionsSlugs,
      companySlug: DEFAULT_COMPANY_SLUG,
      query: {
        search: alwaysString(search),
        rubricSlug,
      },
    });

    return payload;
  } catch (e) {
    console.log('getRubricProductsList error', e);
    return null;
  }
}
