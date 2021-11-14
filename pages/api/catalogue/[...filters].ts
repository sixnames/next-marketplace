import { CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES, ROUTE_CATALOGUE } from 'config/common';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueData } from 'lib/catalogueUtils';
import { noNaN } from 'lib/numbers';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export interface CatalogueApiInputInterface {
  companySlug?: string;
  companyId?: string;
  snippetVisibleAttributesCount?: number | null;
  visibleCategoriesInNavDropdown: string[];
}

async function catalogueData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { locale, city, currency } = await getRequestParams({ req, res });
    const { query } = req;
    const input = JSON.parse(req.body) as CatalogueApiInputInterface;
    const {
      companySlug,
      companyId,
      snippetVisibleAttributesCount,
      visibleCategoriesInNavDropdown,
    } = input;
    const filtersArray = alwaysArray(query.filters).slice(1);
    const [rubricSlug, ...filters] = filtersArray;

    const rawCatalogueData = await getCatalogueData({
      locale,
      companySlug,
      companyId,
      currency,
      city,
      basePath: `${ROUTE_CATALOGUE}/${rubricSlug}`,
      snippetVisibleAttributesCount:
        noNaN(snippetVisibleAttributesCount) || noNaN(CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES),
      visibleCategoriesInNavDropdown,
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
    console.log(e);

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end('{}');
  }
}

export default catalogueData;
