import { getEventsCatalogueData } from 'db/ssr/catalogue/eventCatalogueUtils';
import { alwaysArray } from 'lib/arrayUtils';
import { CATALOGUE_PRODUCTS_LIMIT } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { noNaN } from 'lib/numbers';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export interface EventsCatalogueApiInputInterface {
  companySlug?: string;
  companyId?: string;
  asPath: string;
  limit: number;
}

async function catalogueData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { locale, citySlug, currency } = await getRequestParams({ req, res });
    const { query } = req;
    const input = JSON.parse(req.body) as EventsCatalogueApiInputInterface;
    const { companySlug, companyId, limit, asPath } = input;
    const filtersArray = alwaysArray(query.filters).slice(1);
    const [rubricSlug, ...filters] = filtersArray;

    const links = getProjectLinks({
      rubricSlug,
    });
    const rawCatalogueData = await getEventsCatalogueData({
      asPath,
      locale,
      companySlug,
      companyId,
      currency,
      citySlug,
      basePath: links.events.rubricSlug.url,
      limit: noNaN(limit) || CATALOGUE_PRODUCTS_LIMIT,
      query: {
        filters,
        rubricSlug,
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
    console.log('api/events-catalogue/[...filters] error', e);

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end('{}');
  }
}

export default catalogueData;
