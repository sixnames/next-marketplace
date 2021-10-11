import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  FILTER_BRAND_KEY,
  FILTER_CATEGORY_KEY,
  DEFAULT_LOCALE,
  GENDER_IT,
  FILTER_PRICE_KEY,
  SECONDARY_LOCALE,
  FILTER_RUBRIC_KEY,
  FILTER_COMMON_KEY,
  FILTER_NO_PHOTO_KEY,
} from 'config/common';
import { ObjectIdModel } from 'db/dbModels';
import {
  BrandInterface,
  CategoryInterface,
  OptionInterface,
  AttributeInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
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
    gender: GENDER_IT,
    optionsGroupId,
  };
};

interface GetCategoryFilterAttributeInterface {
  categories?: CategoryInterface[] | null;
  locale: string;
}

export function getCategoryFilterAttribute({
  categories,
  locale,
}: GetCategoryFilterAttributeInterface): AttributeInterface {
  const optionsGroupId = new ObjectId();
  const commonOptionFields = getCommonOptionFields(optionsGroupId);
  const initialOptions: OptionInterface[] = (categories || []).map((category) => {
    const option: OptionInterface = {
      ...commonOptionFields,
      _id: category._id,
      nameI18n: category.nameI18n,
      slug: category.slug,
      parentId: category.parentId,
      priorities: category.priorities,
      views: category.views,
      gender: category.gender,
    };
    return option;
  });

  const options = getTreeFromList<OptionInterface>({
    list: initialOptions,
    childrenFieldName: 'options',
    locale,
  });

  const attribute: AttributeInterface = {
    _id: new ObjectId(),
    attributesGroupId: new ObjectId(),
    optionsGroupId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Категория',
      [SECONDARY_LOCALE]: 'Category',
    },
    slug: FILTER_CATEGORY_KEY,
    childrenCount: options.length,
    priorities: {},
    views: {},
    showInCatalogueNav: false,
    showInCatalogueFilter: true,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
    variant: ATTRIBUTE_VARIANT_SELECT,
    showAsBreadcrumb: false,
    showInCard: true,
    showAsCatalogueBreadcrumb: true,
    capitalise: true,
    notShowAsAlphabet: true,
    showInSnippet: false,
    showInCardTitle: true,
    showInCatalogueTitle: true,
    showInSnippetTitle: true,
    showNameInTitle: false,
    showNameInCardTitle: false,
    showNameInSelectedAttributes: false,
    showNameInSnippetTitle: false,
    positioningInTitle: {
      [DEFAULT_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
      [SECONDARY_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
    },
    options,
  };

  return attribute;
}

interface GetBrandFilterAttributeInterface {
  brands?: BrandInterface[] | null;
  locale: string;
}

export function getBrandFilterAttribute({
  brands,
  locale,
}: GetBrandFilterAttributeInterface): AttributeInterface {
  const optionsGroupId = new ObjectId();
  const commonOptionFields = getCommonOptionFields(optionsGroupId);

  function castBrandToOption(brand: BrandInterface): OptionInterface {
    const option: OptionInterface = {
      ...commonOptionFields,
      _id: brand._id,
      nameI18n: brand.nameI18n,
      name: getFieldStringLocale(brand.nameI18n, locale),
      slug: brand.slug,
      priorities: brand.priorities,
      views: brand.views,
      gender: GENDER_IT,
      options: (brand.collections || []).map((collection) => {
        return {
          ...commonOptionFields,
          _id: collection._id,
          nameI18n: collection.nameI18n,
          name: getFieldStringLocale(collection.nameI18n, locale),
          slug: collection.slug,
          priorities: collection.priorities,
          views: collection.views,
          gender: GENDER_IT,
        };
      }),
    };
    return option;
  }

  const options: OptionInterface[] = (brands || []).map(castBrandToOption);

  const attribute: AttributeInterface = {
    _id: new ObjectId(),
    attributesGroupId: new ObjectId(),
    optionsGroupId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Бренд',
      [SECONDARY_LOCALE]: 'Brand',
    },
    slug: FILTER_BRAND_KEY,
    childrenCount: options.length,
    priorities: {},
    views: {},
    showInCatalogueNav: false,
    showInCatalogueFilter: true,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
    variant: ATTRIBUTE_VARIANT_SELECT,
    showAsBreadcrumb: false,
    showInCard: true,
    showAsCatalogueBreadcrumb: true,
    capitalise: true,
    notShowAsAlphabet: true,
    showInSnippet: false,
    showInCardTitle: true,
    showInCatalogueTitle: true,
    showInSnippetTitle: true,
    showNameInTitle: false,
    showNameInCardTitle: false,
    showNameInSelectedAttributes: false,
    showNameInSnippetTitle: false,
    positioningInTitle: {
      [DEFAULT_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
      [SECONDARY_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
    },
    options,
  };

  return attribute;
}

interface CastRubricsToCatalogueAttributeInterface {
  rubrics: RubricInterface[];
  locale: string;
}

export function getRubricFilterAttribute({
  rubrics,
  locale,
}: CastRubricsToCatalogueAttributeInterface): AttributeInterface {
  const optionsGroupId = new ObjectId();
  const commonOptionFields = getCommonOptionFields(optionsGroupId);

  function castRubricToOption(rubric: RubricInterface): OptionInterface {
    const option: OptionInterface = {
      ...commonOptionFields,
      _id: rubric._id,
      nameI18n: rubric.nameI18n,
      name: getFieldStringLocale(rubric.nameI18n, locale),
      slug: rubric.slug,
      priorities: rubric.priorities,
      views: rubric.views,
      gender: rubric.catalogueTitle.gender,
    };
    return option;
  }

  const options: OptionInterface[] = rubrics.map(castRubricToOption);

  const attribute: AttributeInterface = {
    _id: new ObjectId(),
    attributesGroupId: new ObjectId(),
    optionsGroupId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Рубрика',
      [SECONDARY_LOCALE]: 'Rubric',
    },
    slug: FILTER_RUBRIC_KEY,
    priorities: {},
    views: {},
    showInCatalogueNav: false,
    showInCatalogueFilter: true,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
    variant: ATTRIBUTE_VARIANT_SELECT,
    showAsBreadcrumb: false,
    showInCard: true,
    showAsCatalogueBreadcrumb: true,
    capitalise: true,
    notShowAsAlphabet: true,
    showInSnippet: false,
    showInCardTitle: true,
    showInCatalogueTitle: true,
    showInSnippetTitle: true,
    showNameInTitle: false,
    showNameInCardTitle: false,
    showNameInSelectedAttributes: false,
    showNameInSnippetTitle: false,
    positioningInTitle: {
      [DEFAULT_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
      [SECONDARY_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
    },
    options,
  };

  return attribute;
}

export function getCommonFilterAttribute(): AttributeInterface {
  const optionsGroupId = new ObjectId();
  const commonOptionFields = getCommonOptionFields(optionsGroupId);

  const options: OptionInterface[] = [
    {
      ...commonOptionFields,
      _id: new ObjectId(),
      nameI18n: {
        [DEFAULT_LOCALE]: 'Без фото',
        [SECONDARY_LOCALE]: 'No photo',
      },
      slug: FILTER_NO_PHOTO_KEY,
      gender: GENDER_IT,
    },
  ];

  const attribute: AttributeInterface = {
    _id: new ObjectId(),
    attributesGroupId: new ObjectId(),
    optionsGroupId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Общее',
      [SECONDARY_LOCALE]: 'Common',
    },
    slug: FILTER_COMMON_KEY,
    childrenCount: options.length,
    priorities: {},
    views: {},
    showInCatalogueNav: false,
    showInCatalogueFilter: true,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
    variant: ATTRIBUTE_VARIANT_SELECT,
    showAsBreadcrumb: false,
    showInCard: true,
    showAsCatalogueBreadcrumb: true,
    capitalise: true,
    notShowAsAlphabet: true,
    showInSnippet: false,
    showInCardTitle: true,
    showInCatalogueTitle: true,
    showInSnippetTitle: true,
    showNameInTitle: false,
    showNameInCardTitle: false,
    showNameInSelectedAttributes: false,
    showNameInSnippetTitle: false,
    positioningInTitle: {
      [DEFAULT_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
      [SECONDARY_LOCALE]: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
    },
    options,
  };

  return attribute;
}

export function getPriceAttribute(currency: string): AttributeInterface {
  const optionsGroupId = new ObjectId();
  const commonOptionFields = getCommonOptionFields(optionsGroupId);

  return {
    _id: new ObjectId(),
    attributesGroupId: new ObjectId(),
    optionsGroupId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Цена',
      [SECONDARY_LOCALE]: 'Price',
    },
    slug: FILTER_PRICE_KEY,
    priorities: {},
    views: {},
    metric: {
      _id: new ObjectId(),
      nameI18n: {
        [DEFAULT_LOCALE]: currency,
      },
    },
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG,
    variant: ATTRIBUTE_VARIANT_SELECT,
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
          ru: '15 000 – 30 000',
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
          ru: '500 000 – 1 000 000',
        },
        slug: `500000_1000000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '1 000 000 – 1 500 000',
        },
        slug: `1000000_1500000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '1 500 000 – 3 000 000',
        },
        slug: `1500000_3000000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '3 000 000 – 3 500 000',
        },
        slug: `3000000_3500000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '3 500 000 – 4 000 000',
        },
        slug: `3500000_4000000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '4 000 000 – 4 500 000',
        },
        slug: `4000000_4500000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '4 500 000 – 5 000 000',
        },
        slug: `4500000_5000000`,
      },
      {
        _id: new ObjectId(),
        ...commonOptionFields,
        nameI18n: {
          ru: '5 000 000 – 10 000 000',
        },
        slug: `5000000_10000000`,
      },
    ],
  };
}
