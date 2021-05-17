import { DEFAULT_COUNTERS_OBJECT } from '../../../../config/common';
import { OptionModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const options: OptionModel[] = [
  // Состав
  {
    _id: getObjectId('option Хмель'),
    slug: '000001',
    optionsGroupId: getObjectId('optionsGroup Состав'),
    variants: {},
    nameI18n: {
      ru: 'Хмель',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Вода'),
    slug: '000002',
    optionsGroupId: getObjectId('optionsGroup Состав'),
    variants: {},
    nameI18n: {
      ru: 'Вода',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Солод'),
    slug: '000003',
    optionsGroupId: getObjectId('optionsGroup Состав'),
    variants: {},
    nameI18n: {
      ru: 'Солод',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Регион
  {
    _id: getObjectId('option США'),
    slug: '000004',
    optionsGroupId: getObjectId('optionsGroup Регион'),
    variants: {},
    nameI18n: {
      ru: 'США',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Калифорния'),
    slug: '000005',
    optionsGroupId: getObjectId('optionsGroup Регион'),
    parentId: getObjectId('option США'),
    variants: {},
    nameI18n: {
      ru: 'Калифорния',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Пасо Роблес'),
    slug: '000006',
    optionsGroupId: getObjectId('optionsGroup Регион'),
    parentId: getObjectId('option Калифорния'),
    variants: {},
    nameI18n: {
      ru: 'Пасо Роблес',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Франция'),
    slug: '000007',
    optionsGroupId: getObjectId('optionsGroup Регион'),
    variants: {},
    nameI18n: {
      ru: 'Франция',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Лангедок-Руссийон'),
    slug: '000008',
    optionsGroupId: getObjectId('optionsGroup Регион'),
    parentId: getObjectId('option Франция'),
    variants: {},
    nameI18n: {
      ru: 'Лангедок-Руссийон',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Австралия'),
    slug: '000009',
    optionsGroupId: getObjectId('optionsGroup Регион'),
    variants: {},
    nameI18n: {
      ru: 'Австралия',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Объем
  {
    _id: getObjectId('option 300'),
    slug: '000010',
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '300',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 350'),
    slug: '000011',
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '350',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 500'),
    slug: '000012',
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '500',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 750'),
    slug: '000013',
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '750',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 1000'),
    slug: '000014',
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '1000',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Тип ёмкости
  {
    _id: getObjectId('option Бутылка'),
    slug: '000015',
    optionsGroupId: getObjectId('optionsGroup Тип ёмкости'),
    variants: {},
    nameI18n: {
      ru: 'Бутылка',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Банка'),
    slug: '000016',
    optionsGroupId: getObjectId('optionsGroup Тип ёмкости'),
    variants: {},
    nameI18n: {
      ru: 'Банка',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Год
  {
    _id: getObjectId('option 1914'),
    slug: '000017',
    optionsGroupId: getObjectId('optionsGroup Год'),
    variants: {},
    nameI18n: {
      ru: '1914',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 1950'),
    slug: '000018',
    optionsGroupId: getObjectId('optionsGroup Год'),
    variants: {},
    nameI18n: {
      ru: '1950',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 1984'),
    slug: '000019',
    optionsGroupId: getObjectId('optionsGroup Год'),
    variants: {},
    nameI18n: {
      ru: '1984',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 1999'),
    slug: '000021',
    optionsGroupId: getObjectId('optionsGroup Год'),
    variants: {},
    nameI18n: {
      ru: '1999',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Виноград
  {
    _id: getObjectId('option Бикал'),
    slug: '000022',
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    variants: {},
    nameI18n: {
      ru: 'Бикал',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Аринту'),
    slug: '000023',
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    variants: {},
    nameI18n: {
      ru: 'Аринту',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Бага'),
    slug: '000024',
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    variants: {},
    nameI18n: {
      ru: 'Бага',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Сахар
  {
    _id: getObjectId('option Сухое'),
    slug: '000025',
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    variants: {},
    icon: 'arrow-left',
    nameI18n: {
      ru: 'Сухое',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Сладкое'),
    slug: '000026',
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    variants: {},
    icon: 'burger',
    nameI18n: {
      ru: 'Сладкое',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Полусухое'),
    slug: '000027',
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    variants: {},
    nameI18n: {
      ru: 'Полусухое',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Тип вина
  {
    _id: getObjectId('option Крепленое'),
    slug: '000028',
    optionsGroupId: getObjectId('optionsGroup Тип вина'),
    variants: {},
    color: 'ff0000',
    nameI18n: {
      ru: 'Крепленое',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Плодовое'),
    slug: '000029',
    optionsGroupId: getObjectId('optionsGroup Тип вина'),
    variants: {},
    color: '29b77a',
    nameI18n: {
      ru: 'Плодовое',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Херес'),
    slug: '000030',
    optionsGroupId: getObjectId('optionsGroup Тип вина'),
    variants: {},
    color: 'b09030',
    nameI18n: {
      ru: 'Херес',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = options;
