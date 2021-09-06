import { DEFAULT_COUNTERS_OBJECT, GENDER_IT } from '../../../../config/common';
import { GenderModel, RubricModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const booleans = {
  capitalise: true,
  active: true,
  showRubricNameInProductTitle: true,
  showCategoryInProductTitle: true,
};

const rubrics: RubricModel[] = [
  {
    _id: getObjectId('rubric Шампанское'),
    slug: 'shampanskoe',
    nameI18n: {
      ru: 'Шампанское',
    },
    descriptionI18n: {
      ru: 'Шампанское',
    },
    shortDescriptionI18n: {
      ru: 'Шампанское',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Шампанское',
      },
      keywordI18n: {
        ru: 'Шампанское',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_IT as GenderModel,
    },
    variantId: getObjectId('rubricVariant alcohol'),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('rubric Виски'),
    slug: 'viski',
    nameI18n: {
      ru: 'Виски',
    },
    descriptionI18n: {
      ru: 'Виски',
    },
    shortDescriptionI18n: {
      ru: 'Виски',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Виски',
      },
      keywordI18n: {
        ru: 'Виски',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_IT as GenderModel,
    },
    variantId: getObjectId('rubricVariant water'),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('rubric Вино'),
    slug: 'vino',
    nameI18n: {
      ru: 'Вино',
    },
    descriptionI18n: {
      ru: 'Вино',
    },
    shortDescriptionI18n: {
      ru: 'Вино',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Вино',
      },
      keywordI18n: {
        ru: 'Вино',
      },
      prefixI18n: {
        ru: 'Купить',
      },
      gender: GENDER_IT as GenderModel,
    },
    variantId: getObjectId('rubricVariant alcohol'),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = rubrics;
