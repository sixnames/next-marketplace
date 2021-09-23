import {
  ASSETS_DIST_CATEGORIES,
  CATEGORY_SLUG_PREFIX,
  DEFAULT_COUNTERS_OBJECT,
} from '../../../../config/common';
import { CategoryModel } from '../../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

const categories: CategoryModel[] = [
  {
    _id: getObjectId('category Односолодовый'),
    parentTreeIds: [getObjectId('category Односолодовый')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}1`,
    rubricSlug: 'viski',
    image: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_CATEGORIES}/${CATEGORY_SLUG_PREFIX}1/${CATEGORY_SLUG_PREFIX}1-0.png`,
    variants: {},
    nameI18n: {
      ru: 'Односолодовый',
    },
    attributesGroupIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики виски',
    ]),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый A'),
    parentId: getObjectId('category Односолодовый'),
    parentTreeIds: [getObjectId('category Односолодовый'), getObjectId('category Односолодовый A')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}2`,
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Односолодовый A',
    },
    attributesGroupIds: [],
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
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Односолодовый A-1',
    },
    attributesGroupIds: [],
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
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Односолодовый A-2',
    },
    attributesGroupIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Купажированный'),
    parentTreeIds: [getObjectId('category Купажированный')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}5`,
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Купажированный',
    },
    attributesGroupIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = categories;
