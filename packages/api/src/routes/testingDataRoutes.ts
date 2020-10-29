import createTestData from '../utils/testUtils/createTestData';
import { DEFAULT_LANG, LANG_COOKIE_KEY, THEME_COOKIE_KEY, THEME_DARK } from '@yagu/config';
import { Request, Response } from 'express';
import clearTestData from '../utils/testUtils/clearTestData';
import { attemptSignIn } from '../utils/auth/auth';

export async function createTestDataRoute(_: Request, res: Response) {
  await createTestData();

  // set default lang for tests
  res.cookie(LANG_COOKIE_KEY, DEFAULT_LANG);
  res.cookie(THEME_COOKIE_KEY, THEME_DARK);
  res.send('test data created');
}

export async function clearTestDataRoute(_: Request, res: Response) {
  await clearTestData();
  res.send('test data removed');
}

export async function testSignInRoute(req: Request, res: Response) {
  const lang = req.lang;
  const { email, password } = req.query;
  const { user, message } = await attemptSignIn(`${email}`, `${password}`, lang);

  if (!user) {
    res.status(401);
    res.send(message);
    return;
  }

  req.session!.user = user;
  req.session!.userId = user.id;
  req.session!.roleId = user.role;

  res.send('signed in');
}
