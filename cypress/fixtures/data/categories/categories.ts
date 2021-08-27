import {
  ASSETS_DIST_CATEGORIES,
  CATEGORY_SLUG_PREFIX,
  DEFAULT_COUNTERS_OBJECT,
} from '../../../../config/common';
import { CategoryModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const categories: CategoryModel[] = [
  {
    _id: getObjectId('category Односолодовый'),
    parentTreeIds: [getObjectId('category Односолодовый')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}1`,
    rubricSlug: 'vino',
    image: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_CATEGORIES}/${CATEGORY_SLUG_PREFIX}1/${CATEGORY_SLUG_PREFIX}1-0.png`,
    nameI18n: {
      ru: 'Односолодовый',
    },
    variants: {},
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый A'),
    parentId: getObjectId('category Односолодовый'),
    parentTreeIds: [getObjectId('category Односолодовый'), getObjectId('category Односолодовый A')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}2`,
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый A',
    },
    variants: {},
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый A-1'),
    parentId: getObjectId('category Односолодовый A'),
    parentTreeIds: [
      getObjectId('category Односолодовый'),
      getObjectId('category Односолодовый A'),
      getObjectId('category Односолодовый A-1'),
    ],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}3`,
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый A-1',
    },
    variants: {},
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый A-2'),
    parentId: getObjectId('category Односолодовый A'),
    parentTreeIds: [
      getObjectId('category Односолодовый'),
      getObjectId('category Односолодовый A'),
      getObjectId('category Односолодовый A-2'),
    ],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}4`,
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый A-2',
    },
    variants: {},
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Купажированный'),
    parentTreeIds: [getObjectId('category Купажированный')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}5`,
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Купажированный',
    },
    variants: {},
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = categories;
