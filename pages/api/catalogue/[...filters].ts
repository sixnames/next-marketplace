import { DEFAULT_CITY, DEFAULT_LOCALE } from 'config/common';
import { getCatalogueData } from 'lib/catalogueUtils';
import { noNaN } from 'lib/numbers';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSubdomain } from 'tldts';

export interface CatalogueQueryInterface {
  filters: string[];
  rubricSlug: string;
  companySlug?: string;
  companyId?: string;
  page: number;
  visibleOptionsCount: string;
  snippetVisibleAttributesCount: string;
}

async function catalogueData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { headers, query } = req;
    const anyQuery = query as unknown;
    const locale = req.cookies.locale || DEFAULT_LOCALE;

    const {
      filters,
      companySlug,
      companyId,
      page,
      visibleOptionsCount,
      snippetVisibleAttributesCount,
    } = anyQuery as CatalogueQueryInterface;
    const [rubricSlug, ...restFilters] = filters;
    const host = `${headers.host}`;
    const subdomain = getSubdomain(host, { validHosts: ['localhost'] });
    const sessionCity = subdomain || DEFAULT_CITY;
    const rawCatalogueData = await getCatalogueData({
      locale,
      companySlug,
      companyId,
      city: sessionCity,
      visibleOptionsCount: noNaN(visibleOptionsCount) || 5,
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
