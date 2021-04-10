import { DEFAULT_CITY } from 'config/common';
import { getCatalogueData } from 'lib/catalogueUtils';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSubdomain } from 'tldts';

export interface CatalogueQueryInterface {
  filter: string[];
  lastProductId?: string | null | undefined;
  locale: string;
  companySlug?: string;
  companyId?: string;
}

async function catalogueData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { headers, query } = req;
    const anyQuery = query as unknown;
    const {
      locale,
      filter,
      lastProductId,
      companySlug,
      companyId,
    } = anyQuery as CatalogueQueryInterface;
    const host = `${headers.host}`;
    const subdomain = getSubdomain(host, { validHosts: ['localhost'] });
    const sessionCity = subdomain || DEFAULT_CITY;
    const rawCatalogueData = await getCatalogueData({
      locale,
      companySlug,
      companyId,
      city: sessionCity,
      input: {
        filter: filter.slice(1),
        lastProductId: lastProductId ? new ObjectId(lastProductId) : null,
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
