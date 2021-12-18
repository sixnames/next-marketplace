import { DEFAULT_COUNTERS_OBJECT, GENDER_IT } from '../../../config/common';
import { GenderModel, ObjectIdModel, RubricModel } from '../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';
import attributes from '../attributes/attributes';

const booleans = {
  capitalise: true,
  active: true,
  showRubricNameInProductTitle: true,
  showCategoryInProductTitle: true,
  showBrandInNav: true,
  showBrandInFilter: true,
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
    variantId: getObjectId('rubricVariant alcohol'),
    filterVisibleAttributeIds: attributes.reduce((acc: ObjectIdModel[], attribute) => {
      const exist =
        attribute.attributesGroupId.equals(getObjectId('attributesGroup Общие характеристики')) ||
        attribute.attributesGroupId.equals(
          getObjectId('attributesGroup Характеристики шампанского'),
        );
      if (exist) {
        return [...acc, attribute._id];
      }
      return acc;
    }, []),
    attributesGroupIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики шампанского',
    ]),
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
    variantId: getObjectId('rubricVariant whiskey'),
    filterVisibleAttributeIds: attributes.reduce((acc: ObjectIdModel[], attribute) => {
      const exist =
        attribute.attributesGroupId.equals(getObjectId('attributesGroup Общие характеристики')) ||
        attribute.attributesGroupId.equals(getObjectId('attributesGroup Характеристики виски'));
      if (exist) {
        return [...acc, attribute._id];
      }
      return acc;
    }, []),
    attributesGroupIds: [],
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
    variantId: getObjectId('rubricVariant alcohol'),
    filterVisibleAttributeIds: attributes.reduce((acc: ObjectIdModel[], attribute) => {
      const exist =
        attribute.attributesGroupId.equals(getObjectId('attributesGroup Общие характеристики')) ||
        attribute.attributesGroupId.equals(getObjectId('attributesGroup Характеристики вина'));
      if (exist) {
        return [...acc, attribute._id];
      }
      return acc;
    }, []),
    attributesGroupIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики вина',
    ]),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('rubric Вода'),
    slug: 'voda',
    nameI18n: {
      ru: 'Вода',
    },
    descriptionI18n: {
      ru: 'Вода',
    },
    shortDescriptionI18n: {
      ru: 'Вода',
    },
    defaultTitleI18n: {
      ru: 'Вода',
    },
    keywordI18n: {
      ru: 'Вода',
    },
    prefixI18n: {
      ru: '',
    },
    gender: GENDER_IT as GenderModel,
    variantId: getObjectId('rubricVariant water'),
    filterVisibleAttributeIds: attributes.reduce((acc: ObjectIdModel[], attribute) => {
      const exist =
        attribute.attributesGroupId.equals(getObjectId('attributesGroup Общие характеристики')) ||
        attribute.attributesGroupId.equals(getObjectId('Характеристики воды'));
      if (exist) {
        return [...acc, attribute._id];
      }
      return acc;
    }, []),
    attributesGroupIds: getObjectIds([
      'attributesGroup Общие характеристики',
      'attributesGroup Характеристики воды',
    ]),
    ...booleans,
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = rubrics;
