import { DEFAULT_LOCALE } from 'config/common';
import { getPageSessionUser } from 'lib/ssrUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

async function sessionUserData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req;
    const session = await getSession({ req });

    // Get session
    // Session user
    // const sessionUserStart = new Date().getTime();
    const sessionUser = await getPageSessionUser({
      email: session?.user?.email,
      locale: `${query.locale || DEFAULT_LOCALE}`,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        sessionUser,
      }),
    );
  } catch (e) {
    console.log(e);

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        sessionUser: null,
      }),
    );
  }
}

export default sessionUserData;
