import { ROUTE_CATALOGUE } from 'config/common';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueData } from 'lib/catalogueUtils';
import { noNaN } from 'lib/numbers';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export interface CatalogueApiInputInterface {
  rubricSlug: string;
  companySlug?: string;
  companyId?: string;
  page: number;
  snippetVisibleAttributesCount: string;
}

async function catalogueData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { locale, city, currency } = await getRequestParams({ req, res });
    const { query } = req;
    const input = JSON.parse(req.body) as CatalogueApiInputInterface;
    const filters = alwaysArray(query.filters);
    const { companySlug, companyId, page, snippetVisibleAttributesCount } = input;
    const [rubricSlug, ...restFilters] = filters;

    const rawCatalogueData = await getCatalogueData({
      locale,
      companySlug,
      companyId,
      currency,
      city,
      basePath: `${ROUTE_CATALOGUE}/${rubricSlug}`,
      snippetVisibleAttributesCount: noNaN(snippetVisibleAttributesCount) || 5,
      input: {
        rubricSlug,
        page: noNaN(page),
        filters: restFilters,
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
