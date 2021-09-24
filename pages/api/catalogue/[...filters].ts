import { getCatalogueData } from 'lib/catalogueUtils';
import { noNaN } from 'lib/numbers';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

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
    const { locale, city, currency } = await getRequestParams({ req, res });
    const { query } = req;
    const anyQuery = query as unknown;

    const {
      filters,
      companySlug,
      companyId,
      page,
      visibleOptionsCount,
      snippetVisibleAttributesCount,
    } = anyQuery as CatalogueQueryInterface;
    const [rubricSlug, ...restFilters] = filters;

    const rawCatalogueData = await getCatalogueData({
      locale,
      companySlug,
      companyId,
      currency,
      city,
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
