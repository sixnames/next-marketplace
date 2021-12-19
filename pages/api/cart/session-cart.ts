import { NextApiRequest, NextApiResponse } from 'next';
import nookies from 'nookies';
import { CART_COOKIE_KEY } from '../../../config/common';
import { getSessionCart } from '../../../db/dao/cart/getSessionCart';

export interface CartQueryInterface {
  companyId?: string;
}

async function sessionCartData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const context = { req, res };
    const { query } = req;
    const anyQuery = query as unknown;
    const { companyId } = anyQuery as CartQueryInterface;

    const sessionCart = await getSessionCart({
      companyId,
      context,
    });

    // set cart _id to cookies
    if (sessionCart) {
      nookies.set({ res }, CART_COOKIE_KEY, sessionCart._id.toHexString(), {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
      });
    }

    res.status(200).send({ sessionCart });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      sessionCart: null,
    });
  }
}

export default sessionCartData;
