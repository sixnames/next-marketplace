import {
  DEFAULT_COUNTERS_OBJECT,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
} from '../../../../config/common';
import { GenderModel, RubricModel } from '../../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

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
    active: true,
    variantId: getObjectId('rubricVariant alcohol'),
    attributesGroupsIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики шампанского',
    ]),
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
    active: true,
    variantId: getObjectId('rubricVariant alcohol'),
    attributesGroupsIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики виски',
    ]),
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
        ru: '',
      },
      gender: GENDER_IT as GenderModel,
    },
    active: true,
    variantId: getObjectId('rubricVariant alcohol'),
    attributesGroupsIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики вина',
    ]),
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

export = rubrics;
