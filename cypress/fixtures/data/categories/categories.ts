import { DEFAULT_COUNTERS_OBJECT, GENDER_IT } from '../../../../config/common';
import { CategoryModel, GenderModel } from '../../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

const categories: CategoryModel[] = [
  {
    _id: getObjectId('category Односолодовый'),
    rubricId: getObjectId('rubric Виски'),
    slug: 'odnosolodovyy',
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый',
    },
    descriptionI18n: {
      ru: 'Односолодовый',
    },
    shortDescriptionI18n: {
      ru: 'Односолодовый',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Односолодовый',
      },
      keywordI18n: {
        ru: 'Односолодовый',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_IT as GenderModel,
    },
    active: true,
    variantId: getObjectId('rubricVariant water'),
    attributesGroupsIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый A'),
    parentId: getObjectId('category Односолодовый'),
    rubricId: getObjectId('rubric Виски'),
    slug: 'odnosolodovyy_a',
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый A',
    },
    descriptionI18n: {
      ru: 'Односолодовый A',
    },
    shortDescriptionI18n: {
      ru: 'Односолодовый A',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Односолодовый A',
      },
      keywordI18n: {
        ru: 'Односолодовый A',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_IT as GenderModel,
    },
    active: true,
    variantId: getObjectId('rubricVariant water'),
    attributesGroupsIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики виски',
    ]),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый AA'),
    parentId: getObjectId('category Односолодовый A'),
    rubricId: getObjectId('rubric Виски'),
    slug: 'odnosolodovyy_aa',
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый AA',
    },
    descriptionI18n: {
      ru: 'Односолодовый AA',
    },
    shortDescriptionI18n: {
      ru: 'Односолодовый AA',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Односолодовый AA',
      },
      keywordI18n: {
        ru: 'Односолодовый AA',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_IT as GenderModel,
    },
    active: true,
    variantId: getObjectId('rubricVariant water'),
    attributesGroupsIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('category Односолодовый AB'),
    parentId: getObjectId('category Односолодовый A'),
    rubricId: getObjectId('rubric Виски'),
    slug: 'odnosolodovyy_ab',
    rubricSlug: 'vino',
    nameI18n: {
      ru: 'Односолодовый AB',
    },
    descriptionI18n: {
      ru: 'Односолодовый AB',
    },
    shortDescriptionI18n: {
      ru: 'Односолодовый AB',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Односолодовый AB',
      },
      keywordI18n: {
        ru: 'Односолодовый AB',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_IT as GenderModel,
    },
    active: true,
    variantId: getObjectId('rubricVariant water'),
    attributesGroupsIds: [],
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = categories;
