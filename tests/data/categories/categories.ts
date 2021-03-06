import { CategoryModel } from 'db/dbModels';
import {
  ASSETS_DIST_CATEGORIES,
  CATEGORY_SLUG_PREFIX,
  DEFAULT_COUNTERS_OBJECT,
} from 'lib/config/common';
import { getObjectId } from 'mongo-seeding';

const categories: CategoryModel[] = [
  {
    _id: getObjectId('category Односолодовый'),
    parentTreeIds: [getObjectId('category Односолодовый')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}1`,
    rubricSlug: 'viski',
    image: `/assets/${ASSETS_DIST_CATEGORIES}/${CATEGORY_SLUG_PREFIX}1/${CATEGORY_SLUG_PREFIX}1-0.png`,
    variants: {},
    nameI18n: {
      ru: 'Односолодовый',
    },
    cmsCardAttributeIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый B'),
    parentId: getObjectId('category Односолодовый'),
    parentTreeIds: [getObjectId('category Односолодовый'), getObjectId('category Односолодовый B')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}10`,
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Односолодовый B',
    },
    cmsCardAttributeIds: [],
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
    cmsCardAttributeIds: [],
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
    cmsCardAttributeIds: [],
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
    cmsCardAttributeIds: [],
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
    cmsCardAttributeIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category C'),
    parentTreeIds: [getObjectId('category C')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}6`,
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Category C',
    },
    cmsCardAttributeIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category D'),
    parentTreeIds: [getObjectId('category D')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}7`,
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Category D',
    },
    cmsCardAttributeIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category E'),
    parentTreeIds: [getObjectId('category E')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}8`,
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Category E',
    },
    cmsCardAttributeIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category F'),
    parentTreeIds: [getObjectId('category F')],
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}9`,
    rubricSlug: 'viski',
    variants: {},
    nameI18n: {
      ru: 'Category F',
    },
    cmsCardAttributeIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = categories;
