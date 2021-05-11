import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: null,
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: null,
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: null,
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: true,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_END as AttributePositionInTitleModel,
    },
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_END as AttributePositionInTitleModel,
    },
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_END as AttributePositionInTitleModel,
    },
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD as AttributePositionInTitleModel,
    },
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_END as AttributePositionInTitleModel,
    },
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
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
    showInCard: true,
    showAsBreadcrumb: false,
    capitalise: false,
    positioningInTitle: {
      ru: ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD as AttributePositionInTitleModel,
    },
  },
];

export = attributes;
