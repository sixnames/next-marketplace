import createTestData from '../src/utils/testUtils/createTestData';
import {
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_LANG,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  ISO_LANGUAGES,
  LANG_COOKIE_KEY,
  ME_AS_ADMIN,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_STRING,
  MOCK_ATTRIBUTE_WINE_COLOR,
  MOCK_ATTRIBUTE_WINE_VARIANT,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
  MOCK_OPTIONS_GROUP_COLORS,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_WINE_VARIANT,
  MOCK_PRODUCT_A,
  MOCK_PRODUCT_B,
  MOCK_PRODUCT_C,
  MOCK_PRODUCT_CREATE,
  MOCK_PRODUCT_NEW,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE_A_A,
  MOCK_RUBRIC_LEVEL_THREE_A_B,
  MOCK_RUBRIC_LEVEL_THREE_B_A,
  MOCK_RUBRIC_LEVEL_TWO_A,
  MOCK_RUBRIC_VARIANT_ALCOHOL,
  MOCK_RUBRIC_VARIANT_JUICE,
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_MANAGER,
} from '../src/config';
import { Request, Response } from 'express';
import clearTestData from '../src/utils/testUtils/clearTestData';
import { attemptSignIn } from '../src/utils/auth';

export async function getMockDataRoute(_: Request, res: Response) {
  res.send({
    ISO_LANGUAGES,
    ME_AS_ADMIN,
    MOCK_PRODUCT_B,
    MOCK_PRODUCT_C,
    MOCK_RUBRIC_LEVEL_THREE_A_A,
    MOCK_RUBRIC_LEVEL_THREE_A_B,
    MOCK_RUBRIC_LEVEL_THREE_B_A,
    MOCK_PRODUCT_NEW,
    MOCK_PRODUCT_CREATE,
    MOCK_OPTIONS_WINE_COLOR,
    MOCK_ATTRIBUTE_WINE_VARIANT,
    MOCK_OPTIONS_WINE_VARIANT,
    MOCK_ATTRIBUTE_STRING,
    MOCK_ATTRIBUTE_NUMBER,
    ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
    MOCK_ATTRIBUTES_GROUP_WINE_FEATURES,
    MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
    MOCK_OPTIONS_GROUP_COLORS,
    ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
    ATTRIBUTE_VARIANT_SELECT,
    ATTRIBUTE_POSITION_IN_TITLE_END,
    ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
    GENDER_SHE,
    GENDER_HE,
    GENDER_IT,
    MOCK_ATTRIBUTE_WINE_COLOR,
    MOCK_RUBRIC_LEVEL_ONE,
    MOCK_RUBRIC_LEVEL_TWO_A,
    MOCK_PRODUCT_A,
    MOCK_RUBRIC_VARIANT_ALCOHOL,
    MOCK_RUBRIC_VARIANT_JUICE,
  });
}

export async function createTestDataRoute(_: Request, res: Response) {
  await createTestData();

  // set default lang for tests
  res.cookie(LANG_COOKIE_KEY, DEFAULT_LANG);
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

  req.session!.userId = user.id;
  req.session!.userRole = user.role;
  req.session!.isAdmin = user.role === ROLE_ADMIN;
  req.session!.isCustomer = user.role === ROLE_CUSTOMER;
  req.session!.isManager = user.role === ROLE_MANAGER;

  res.send('signed in');
}
