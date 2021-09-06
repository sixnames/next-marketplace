import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
} from '../../../../config/common';
import {
  AttributeModel,
  AttributePositionInTitleModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
} from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const booleans = {
  showInSnippet: true,
  showInCard: true,
  showInCatalogueFilter: true,
  showInCatalogueNav: true,
  showInCatalogueTitle: true,
  showInCardTitle: true,
  showInSnippetTitle: true,
  showAsBreadcrumb: true,
  showAsCatalogueBreadcrumb: true,
  notShowAsAlphabet: false,
  capitalise: false,
};

const attributes: AttributeModel[] = [
  {
    _id: getObjectId(`attribute Описание`),
    slug: 'tsvet',
    nameI18n: {
      ru: 'Описание',
    },
    variant: ATTRIBUTE_VARIANT_STRING as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TEXT as AttributeViewVariantModel,
    optionsGroupId: null,
    positioningInTitle: null,
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Количество в упаковке`),
    slug: 'kolichestvo_v_upakovke',
    nameI18n: {
      ru: 'Количество в упаковке',
    },
    variant: ATTRIBUTE_VARIANT_NUMBER as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: null,
    metric: {
      _id: getObjectId('units'),
      nameI18n: {
        ru: 'ед.',
        en: 'units',
      },
    },
    positioningInTitle: null,
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Сочетание`),
    slug: 'sochetanie',
    nameI18n: {
      ru: 'Сочетание',
    },
    variant: ATTRIBUTE_VARIANT_MULTIPLE_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_ICON as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    positioningInTitle: null,
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Крепость`),
    slug: 'krepost',
    nameI18n: {
      ru: 'Крепость',
    },
    variant: ATTRIBUTE_VARIANT_NUMBER as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: null,
    metric: {
      _id: getObjectId('°'),
      nameI18n: {
        ru: '°',
        en: '°',
      },
    },
    positioningInTitle: null,
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Состав`),
    slug: 'sostav',
    nameI18n: {
      ru: 'Состав',
    },
    variant: ATTRIBUTE_VARIANT_MULTIPLE_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Состав'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Регион`),
    slug: 'region',
    nameI18n: {
      ru: 'Регион',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Регион'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_END as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Объем`),
    slug: 'obem',
    nameI18n: {
      ru: 'Объем',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Объем'),
    metric: {
      _id: getObjectId('ml'),
      nameI18n: {
        ru: 'мл.',
        en: 'ml',
      },
    },
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_END as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Тип ёмкости`),
    slug: 'tip_yomkosti',
    nameI18n: {
      ru: 'Тип ёмкости',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Тип ёмкости'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Год`),
    slug: 'god',
    nameI18n: {
      ru: 'Год',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Год'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_END as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Виноград`),
    slug: 'vinograd',
    nameI18n: {
      ru: 'Виноград',
    },
    variant: ATTRIBUTE_VARIANT_MULTIPLE_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_TAG as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Винтаж`),
    slug: 'vintazh',
    nameI18n: {
      ru: 'Винтаж',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Год'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_END as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Сахар`),
    slug: 'sakhar',
    nameI18n: {
      ru: 'Сахар',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Общие характеристики'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Тип шампанского`),
    slug: 'tip_vina',
    nameI18n: {
      ru: 'Тип шампанского',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Тип шампанского'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Характеристики шампанского'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Тип виски`),
    slug: 'tip_vina',
    nameI18n: {
      ru: 'Тип виски',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Тип виски'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Характеристики виски'),
    ...booleans,
  },
  {
    _id: getObjectId(`attribute Тип вина`),
    slug: 'tip_vina',
    nameI18n: {
      ru: 'Тип вина',
    },
    variant: ATTRIBUTE_VARIANT_SELECT as AttributeVariantModel,
    viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST as AttributeViewVariantModel,
    optionsGroupId: getObjectId('optionsGroup Тип вина'),
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
    attributesGroupId: getObjectId('attributesGroup Характеристики вина'),
    ...booleans,
  },
];

// @ts-ignore
export = attributes;
