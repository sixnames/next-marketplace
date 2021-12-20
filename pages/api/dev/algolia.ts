import { NextApiRequest, NextApiResponse } from 'next';
import { updateAlgoliaProducts } from '../../../lib/algolia/productAlgoliaUtils';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  // const start = new Date().getTime();
  if (!process.env.DEV_ENV) {
    res.status(401).send({
      success: false,
      message: 'error',
    });
    return;
  }

  // console.log('Send ', new Date().getTime() - start);
  res.status(200).send({
    success: true,
    message: 'success',
  });
  await updateAlgoliaProducts();
  // console.log('updateAlgoliaProducts ', new Date().getTime() - start);
};
