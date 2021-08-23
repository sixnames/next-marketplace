import { CATEGORY_SLUG_PREFIX, DEFAULT_COUNTERS_OBJECT } from '../../../../config/common';
import { CategoryModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const categories: CategoryModel[] = [
  {
    _id: getObjectId('category Односолодовый'),
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}1`,
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый',
    },
    variants: {},
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый A'),
    parentId: getObjectId('category Односолодовый'),
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
    rubricId: getObjectId('rubric Виски'),
    slug: `${CATEGORY_SLUG_PREFIX}4`,
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый A-2',
    },
    variants: {},
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = categories;
