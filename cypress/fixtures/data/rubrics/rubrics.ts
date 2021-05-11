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
    _id: getObjectId('rubric Пиво'),
    slug: 'pivo',
    nameI18n: {
      ru: 'Пиво',
    },
    descriptionI18n: {
      ru: 'Пиво',
    },
    shortDescriptionI18n: {
      ru: 'Пиво',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Пиво',
      },
      keywordI18n: {
        ru: 'Пиво',
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
      'attributesGroup Характеристики пива',
    ]),
    ...DEFAULT_COUNTERS_OBJECT,
  },
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
    _id: getObjectId('rubric Коньяк'),
    slug: 'konyak',
    nameI18n: {
      ru: 'Коньяк',
    },
    descriptionI18n: {
      ru: 'Коньяк',
    },
    shortDescriptionI18n: {
      ru: 'Коньяк',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Коньяк',
      },
      keywordI18n: {
        ru: 'Коньяк',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_HE as GenderModel,
    },
    active: true,
    variantId: getObjectId('rubricVariant alcohol'),
    attributesGroupsIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики коньяка',
    ]),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('rubric Ликёр'),
    slug: 'likyor',
    nameI18n: {
      ru: 'Ликёр',
    },
    descriptionI18n: {
      ru: 'Ликёр',
    },
    shortDescriptionI18n: {
      ru: 'Ликёр',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Ликёр',
      },
      keywordI18n: {
        ru: 'Ликёр',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_HE as GenderModel,
    },
    active: true,
    variantId: getObjectId('rubricVariant alcohol'),
    attributesGroupsIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики ликёра',
    ]),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('rubric Водка'),
    slug: 'vodka',
    nameI18n: {
      ru: 'Водка',
    },
    descriptionI18n: {
      ru: 'Водка',
    },
    shortDescriptionI18n: {
      ru: 'Водка',
    },
    catalogueTitle: {
      defaultTitleI18n: {
        ru: 'Водка',
      },
      keywordI18n: {
        ru: 'Водка',
      },
      prefixI18n: {
        ru: '',
      },
      gender: GENDER_SHE as GenderModel,
    },
    active: true,
    variantId: getObjectId('rubricVariant alcohol'),
    attributesGroupsIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики водки',
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
