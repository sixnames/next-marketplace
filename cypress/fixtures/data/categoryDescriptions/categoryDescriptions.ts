import { getConstructorContentFromText } from '../../../../lib/stringUtils';
import {
  CATEGORY_SLUG_PREFIX,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
} from '../../../../config/common';
import { CategoryDescriptionModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const categoryDescriptions: CategoryDescriptionModel[] = [
  {
    _id: getObjectId('description A'),
    categoryId: getObjectId('category Односолодовый'),
    categorySlug: `${CATEGORY_SLUG_PREFIX}1`,
    companySlug: DEFAULT_COMPANY_SLUG,
    position: 'top',
    assetKeys: [],
    content: {
      [DEFAULT_CITY]: getConstructorContentFromText(
        'Category top Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
      ),
    },
  },
  {
    _id: getObjectId('description B'),
    categoryId: getObjectId('category Односолодовый'),
    categorySlug: `${CATEGORY_SLUG_PREFIX}1`,
    companySlug: DEFAULT_COMPANY_SLUG,
    position: 'bottom',
    assetKeys: [],
    content: {
      [DEFAULT_CITY]: getConstructorContentFromText(
        'Category bottom Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, doloribus laborum maxime non nulla pariatur repellendus tenetur vel. Alias doloremque dolores earum ipsa magnam maxime nemo quos repellendus suscipit veritatis.',
      ),
    },
  },
];

// @ts-ignore
export = categoryDescriptions;
