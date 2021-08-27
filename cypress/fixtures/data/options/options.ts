import { DEFAULT_COUNTERS_OBJECT, ID_COUNTER_DIGITS } from '../../../../config/common';
import { OptionModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
const addZero = require('add-zero');

type OptionBaseModel = Omit<OptionModel, 'slug'>;

const yearOptionsCount = 10;
const yearOptionsBase = (): OptionBaseModel[] => {
  let counter = 1980;
  const bases: OptionBaseModel[] = [];

  while (bases.length <= yearOptionsCount) {
    counter = counter + 1;
    bases.push({
      _id: getObjectId(`option ${counter}`),
      optionsGroupId: getObjectId('optionsGroup Год'),
      variants: {},
      nameI18n: {
        ru: `${counter}`,
      },
      ...DEFAULT_COUNTERS_OBJECT,
    });
  }

  return bases;
};

const optionsBase: OptionBaseModel[] = [
  // Состав
  {
    _id: getObjectId('option Хмель'),
    optionsGroupId: getObjectId('optionsGroup Состав'),
    variants: {},
    nameI18n: {
      ru: 'Хмель',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Вода'),
    optionsGroupId: getObjectId('optionsGroup Состав'),
    variants: {},
    nameI18n: {
      ru: 'Вода',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Солод'),
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
    optionsGroupId: getObjectId('optionsGroup Регион'),
    variants: {},
    nameI18n: {
      ru: 'США',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Калифорния'),
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
    optionsGroupId: getObjectId('optionsGroup Регион'),
    variants: {},
    nameI18n: {
      ru: 'Франция',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Лангедок-Руссийон'),
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
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '300',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 350'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '350',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 500'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '500',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 750'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '750',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 1000'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '1000',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option 1500'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    variants: {},
    nameI18n: {
      ru: '1500',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Тип ёмкости
  {
    _id: getObjectId('option Бутылка'),
    optionsGroupId: getObjectId('optionsGroup Тип ёмкости'),
    variants: {},
    nameI18n: {
      ru: 'Бутылка',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Банка'),
    optionsGroupId: getObjectId('optionsGroup Тип ёмкости'),
    variants: {},
    nameI18n: {
      ru: 'Банка',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Виноград
  {
    _id: getObjectId('option Бикал'),
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    variants: {},
    nameI18n: {
      ru: 'Бикал',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Аринту'),
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    variants: {},
    nameI18n: {
      ru: 'Аринту',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Бага'),
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
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    variants: {},
    nameI18n: {
      ru: 'Сухое',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Сладкое'),
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    variants: {},
    nameI18n: {
      ru: 'Сладкое',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Полусухое'),
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
    optionsGroupId: getObjectId('optionsGroup Тип вина'),
    variants: {},
    color: 'b09030',
    nameI18n: {
      ru: 'Херес',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },

  // Сочетание
  {
    _id: getObjectId('option Белое мясо'),
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    variants: {},
    nameI18n: {
      ru: 'Белое мясо',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Дары моря'),
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    variants: {},
    nameI18n: {
      ru: 'Дары моря',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Суп'),
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    variants: {},
    nameI18n: {
      ru: 'Суп',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('option Рыба'),
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    variants: {},
    nameI18n: {
      ru: 'Рыба',
    },
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

const options: OptionModel[] = [...optionsBase, ...yearOptionsBase()].map((base, i) => {
  return {
    slug: addZero(i, ID_COUNTER_DIGITS),
    ...base,
  };
});

// @ts-ignore
export = options;
