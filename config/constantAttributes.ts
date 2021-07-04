import {
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  GENDER_IT,
  PRICE_ATTRIBUTE_SLUG,
} from 'config/common';
import {
  AttributeVariantModel,
  AttributeViewVariantModel,
  GenderModel,
  RubricOptionModel,
} from 'db/dbModels';
import { RubricAttributeInterface } from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';

export function getPriceAttribute(): RubricAttributeInterface {
  const optionsGroupId = new ObjectId();
  const commonOptionFields: Omit<RubricOptionModel, 'nameI18n' | '_id' | 'slug'> = {
    priorities: {},
    views: {},
    options: [],
    variants: {},
    gender: GENDER_IT as GenderModel,
    optionsGroupId,
  };

  return {
    _id: new ObjectId(),
    attributeId: new ObjectId(),
    rubricId: new ObjectId(),
    rubricSlug: 'slug',
    attributesGroupId: new ObjectId(),
    optionsGroupId,
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
    showAsBreadcrumb: false,
    showInCard: true,
    showInProductAttributes: true,
    options: [
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: 'До 500',
        },
        slug: `1_500`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '500 – 1 000',
        },
        slug: `500_1000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '1 000 – 1 500',
        },
        slug: `1000_1500`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '1 500 – 3 000',
        },
        slug: `1500_3000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '3 000 – 5 000',
        },
        slug: `3000_5000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '5 000 – 15 000',
        },
        slug: `5000_15000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '15 000 – 30 00',
        },
        slug: `15000_30000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '30 000 – 50 000',
        },
        slug: `30000_50000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: 'От 50 000',
        },
        slug: `50000_100000000`,
      },
    ],
  };
}
