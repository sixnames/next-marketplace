import createTestData from '../utils/testUtils/createTestData';
import { DEFAULT_LANG, LANG_COOKIE_KEY, THEME_COOKIE_KEY, THEME_DARK } from '@yagu/config';
import clearTestData from '../utils/testUtils/clearTestData';
import { Response } from 'express';

export async function createTestDataRoute(_req: any, res: Response) {
  await clearTestData();
  const mockData = await createTestData();

  // set default lang for tests
  res.cookie(LANG_COOKIE_KEY, DEFAULT_LANG);
  res.cookie(THEME_COOKIE_KEY, THEME_DARK);
  res.json(mockData);
}

export async function clearTestDataRoute(_req: any, res: Response) {
  await clearTestData();
  res.send('test data removed');
}
