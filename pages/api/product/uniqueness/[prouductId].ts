import { getApiMessageValue } from 'lib/apiMessageUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { locale } = await getRequestParams({ req, res });
  console.log(req.query.productId);
  console.log(req.body);

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'products.update.success',
      locale,
    }),
  });
};
