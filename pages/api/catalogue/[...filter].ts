import { DEFAULT_CITY } from 'config/common';
import { getCatalogueData } from 'lib/catalogueUtils';
import { noNaN } from 'lib/numbers';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSubdomain } from 'tldts';

export interface CatalogueQueryInterface {
  filter: string[];
  locale: string;
  companySlug?: string;
  companyId?: string;
  page: number;
}

async function catalogueData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { headers, query } = req;
    const anyQuery = query as unknown;
    const { locale, filter, companySlug, companyId, page } = anyQuery as CatalogueQueryInterface;
    const host = `${headers.host}`;
    const subdomain = getSubdomain(host, { validHosts: ['localhost'] });
    const sessionCity = subdomain || DEFAULT_CITY;
    const rawCatalogueData = await getCatalogueData({
      locale,
      companySlug,
      companyId,
      city: sessionCity,
      input: {
        page: noNaN(page),
        filter: filter.slice(1),
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
