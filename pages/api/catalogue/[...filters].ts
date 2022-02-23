import { getCatalogueData } from 'db/ssr/catalogue/catalogueUtils';
import { alwaysArray } from 'lib/arrayUtils';
import { CATALOGUE_PRODUCTS_LIMIT, CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { noNaN } from 'lib/numbers';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export interface CatalogueApiInputInterface {
  companySlug?: string;
  companyId?: string;
  asPath: string;
  snippetVisibleAttributesCount?: number | null;
  visibleCategoriesInNavDropdown: string[];
  limit: number;
}

async function catalogueData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { locale, citySlug, currency } = await getRequestParams({ req, res });
    const { query } = req;
    const input = JSON.parse(req.body) as CatalogueApiInputInterface;
    const {
      companySlug,
      companyId,
      snippetVisibleAttributesCount,
      visibleCategoriesInNavDropdown,
      limit,
      asPath,
    } = input;
    const filtersArray = alwaysArray(query.filters).slice(1);
    const [rubricSlug, ...filters] = filtersArray;

    const links = getProjectLinks({
      rubricSlug,
    });
    const rawCatalogueData = await getCatalogueData({
      asPath,
      locale,
      companySlug,
      companyId,
      currency,
      citySlug,
      basePath: links.catalogue.rubricSlug.url,
      snippetVisibleAttributesCount:
        noNaN(snippetVisibleAttributesCount) || noNaN(CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES),
      visibleCategoriesInNavDropdown,
      limit: noNaN(limit) || CATALOGUE_PRODUCTS_LIMIT,
      input: {
        rubricSlug,
        page: noNaN(1),
        filters,
      },
    });
    if (!rawCatalogueData) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end('{}');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rawCatalogueData));
  } catch (e) {
    console.log('api/catalogue/[...filters] error', e);

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end('{}');
  }
}

export default catalogueData;
