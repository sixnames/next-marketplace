import { REQUEST_METHOD_GET } from 'config/common';
import {
  getRubricProductsList,
  GetRubricProductsListInputInterface,
} from 'db/dao/product/getRubricProductsList';
import { alwaysString } from 'lib/arrayUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // get list of rubrics
  if (req.method === REQUEST_METHOD_GET) {
    const { locale, currency } = await getRequestParams({ req, res });
    const paramsString = `${req.url}`.split('?')[1];
    const params = qs.parse(
      alwaysString(paramsString),
    ) as unknown as GetRubricProductsListInputInterface;

    const payload = await getRubricProductsList({
      ...params,
      locale,
      currency,
    });
    res.status(200).send(payload);
    return;
  }

  res.status(405).send({
    success: false,
    message: 'wrong method',
  });
  return;
};
