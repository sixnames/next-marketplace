import {
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  CATALOGUE_CATEGORY_KEY,
  DEFAULT_LOCALE,
  GENDER_IT,
  PRICE_ATTRIBUTE_SLUG,
  SECONDARY_LOCALE,
} from 'config/common';
import {
  AttributePositionInTitleModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
  GenderModel,
  ObjectIdModel,
} from 'db/dbModels';
import { CategoryInterface, OptionInterface, RubricAttributeInterface } from 'db/uiInterfaces';
import { getTreeFromList } from 'lib/optionsUtils';
import { ObjectId } from 'mongodb';

export const getCommonOptionFields = (
  optionsGroupId: ObjectIdModel,
): Omit<OptionInterface, 'nameI18n' | '_id' | 'slug'> => {
  return {
    priorities: {},
    views: {},
    options: [],
    variants: {},
    gender: GENDER_IT as GenderModel,
    optionsGroupId,
  };
};

interface GetCategoryFilterAttributeInterface {
  categories: CategoryInterface[];
  locale: string;
}

export function getCategoryFilterAttribute({
  categories,
  locale,
}: GetCategoryFilterAttributeInterface): RubricAttributeInterface {
  const optionsGroupId = new ObjectId();
  const commonOptionFields = getCommonOptionFields(optionsGroupId);
  const initialOptions: OptionInterface[] = categories.map((category) => {
    const option: OptionInterface = {
      ...commonOptionFields,
      _id: category._id,
      nameI18n: category.nameI18n,
      slug: category.slug,
      parentId: category.parentId,
      priorities: category.priorities,
      views: category.views,
    };
    return option;
  });

  const options = getTreeFromList<OptionInterface>({
    list: initialOptions,
    childrenFieldName: 'options',
    locale,
  });

  const attribute: RubricAttributeInterface = {
    _id: new ObjectId(),
    attributeId: new ObjectId(),
    rubricId: new ObjectId(),
    rubricSlug: 'slug',
    attributesGroupId: new ObjectId(),
    optionsGroupId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Категория',
      [SECONDARY_LOCALE]: 'Category',
    },
    slug: CATALOGUE_CATEGORY_KEY,
    priorities: {},
    views: {},
    showInCatalogueNav: false,
    showInCatalogueFilter: true,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG as AttributeViewVariantModel,
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    showAsBreadcrumb: false,
    showInCard: true,
    showAsCatalogueBreadcrumb: true,
    capitalise: true,
    notShowAsAlphabet: true,
    showNameInTitle: true,
    showInSnippet: false,
    showInCardTitle: false,
    showInCatalogueTitle: true,
    showInSnippetTitle: false,
    showNameInCardTitle: false,
    showNameInSelectedAttributes: true,
    showNameInSnippetTitle: false,
    positioningInTitle: {
      [DEFAULT_LOCALE]:
        ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD as AttributePositionInTitleModel,
      [SECONDARY_LOCALE]:
        ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD as AttributePositionInTitleModel,
    },
    options,
  };

  return attribute;
}

export function getPriceAttribute(): RubricAttributeInterface {
  const optionsGroupId = new ObjectId();
  const commonOptionFields = getCommonOptionFields(optionsGroupId);

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
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG as AttributeViewVariantModel,
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    showInCatalogueNav: false,
    showInCatalogueFilter: true,
    showAsBreadcrumb: false,
    showAsCatalogueBreadcrumb: false,
    notShowAsAlphabet: true,
    showNameInTitle: true,
    showInSnippet: false,
    showInCardTitle: false,
    showInCatalogueTitle: true,
    showInSnippetTitle: false,
    showNameInCardTitle: false,
    showNameInSelectedAttributes: true,
    showNameInSnippetTitle: false,
    showInCard: false,
    capitalise: false,
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
          ru: '50 000 – 100 000',
        },
        slug: `50000_100000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '100 000 – 150 000',
        },
        slug: `100000_150000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '150 000 – 200 000',
        },
        slug: `150000_200000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '200 000 – 250 000',
        },
        slug: `200000_250000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '250 000 – 500 000',
        },
        slug: `250000_500000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '500 000 – 1000 000',
        },
        slug: `500000_1000000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '1000 000 – 1500 000',
        },
        slug: `1000000_1500000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '1500 000 – 3000 000',
        },
        slug: `1500000_3000000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '3000 000 – 3500 000',
        },
        slug: `3000000_3500000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '3500 000 – 4000 000',
        },
        slug: `3500000_4000000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '4000 000 – 4500 000',
        },
        slug: `4000000_4500000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '4500 000 – 5000 000',
        },
        slug: `4500000_5000000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '5000 000 – 10 000 000',
        },
        slug: `5000000_10000000`,
      },
    ],
  };
}
