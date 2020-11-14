import createTestData from '../utils/testUtils/createTestData';
import { DEFAULT_LANG, LANG_COOKIE_KEY, THEME_COOKIE_KEY, THEME_DARK } from '@yagu/config';
import clearTestData from '../utils/testUtils/clearTestData';
import { UserModel } from '../entities/User';
import { Response } from 'express';

export async function createTestDataRoute(_req: any, res: Response) {
  await clearTestData();
  await createTestData();

  // set default lang for tests
  res.cookie(LANG_COOKIE_KEY, DEFAULT_LANG);
  res.cookie(THEME_COOKIE_KEY, THEME_DARK);
  res.send('test data created');
}

export async function clearTestDataRoute(_req: any, res: Response) {
  await clearTestData();
  res.send('test data removed');
}

export async function testSignInRoute(req: any, res: Response) {
  const { query, lang } = req;
  const { email, password } = query;
  const { user, message } = await UserModel.attemptSignIn(`${email}`, `${password}`, lang);

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
