import {
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  CATALOGUE_OPTION_SEPARATOR,
  GENDER_IT,
  PRICE_ATTRIBUTE_SLUG,
} from 'config/common';
import {
  AttributeVariantModel,
  AttributeViewVariantModel,
  GenderModel,
  RubricAttributeModel,
  RubricOptionModel,
} from 'db/dbModels';
import { ObjectId } from 'mongodb';

export function getPriceAttribute(): RubricAttributeModel {
  const commonOptionFields: Omit<RubricOptionModel, 'nameI18n' | '_id' | 'slug'> = {
    priorities: {},
    views: {},
    options: [],
    variants: {},
    productsCount: 0,
    gender: GENDER_IT as GenderModel,
  };

  const optionSlugPrefix = `${PRICE_ATTRIBUTE_SLUG}${CATALOGUE_OPTION_SEPARATOR}`;

  return {
    _id: new ObjectId(),
    nameI18n: {
      ru: 'Цена',
      en: 'Price',
    },
    slug: PRICE_ATTRIBUTE_SLUG,
    priorities: {},
    views: {},
    showInCatalogueNav: false,
    showInCatalogueFilter: true,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG as AttributeViewVariantModel,
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    options: [
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: 'До 500',
        },
        slug: `${optionSlugPrefix}1_500`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '500 – 1 000',
        },
        slug: `${optionSlugPrefix}500_1000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '1 000 – 1 500',
        },
        slug: `${optionSlugPrefix}1000_1500`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '1 500 – 3 000',
        },
        slug: `${optionSlugPrefix}1500_3000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '3 000 – 5 000',
        },
        slug: `${optionSlugPrefix}3000_5000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '5 000 – 15 000',
        },
        slug: `${optionSlugPrefix}5000_15000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '15 000 – 30 00',
        },
        slug: `${optionSlugPrefix}15000_30000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '30 000 – 50 000',
        },
        slug: `${optionSlugPrefix}3000_50000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: 'От 50 000',
        },
        slug: `${optionSlugPrefix}50000_100000000`,
      },
    ],
  };
}
