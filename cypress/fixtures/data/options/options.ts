import { DEFAULT_COUNTERS_OBJECT, ID_COUNTER_DIGITS } from '../../../../config/common';
import { OptionModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
const addZero = require('add-zero');

interface OptionBaseModel extends Omit<OptionModel, 'slug' | 'priorities' | 'views' | 'variants'> {
  slug?: string;
}

const yearOptionsCount = 10;
const yearOptionsBase = (): OptionBaseModel[] => {
  let counter = 1980;
  const bases: OptionBaseModel[] = [];

  while (bases.length <= yearOptionsCount) {
    counter = counter + 1;
    bases.push({
      _id: getObjectId(`option ${counter}`),
      optionsGroupId: getObjectId('optionsGroup Год'),
      nameI18n: {
        ru: `${counter}`,
      },
    });
  }

  return bases;
};

const optionsBase: OptionBaseModel[] = [
  // Состав
  {
    _id: getObjectId('option Хмель'),
    optionsGroupId: getObjectId('optionsGroup Состав'),
    nameI18n: {
      ru: 'Хмель',
    },
  },
  {
    _id: getObjectId('option Вода'),
    optionsGroupId: getObjectId('optionsGroup Состав'),
    nameI18n: {
      ru: 'Вода',
    },
  },
  {
    _id: getObjectId('option Солод'),
    optionsGroupId: getObjectId('optionsGroup Состав'),

    nameI18n: {
      ru: 'Солод',
    },
  },

  // Регион
  {
    _id: getObjectId('option США'),
    optionsGroupId: getObjectId('optionsGroup Регион'),
    nameI18n: {
      ru: 'США',
    },
  },
  {
    _id: getObjectId('option Калифорния'),
    optionsGroupId: getObjectId('optionsGroup Регион'),
    parentId: getObjectId('option США'),

    nameI18n: {
      ru: 'Калифорния',
    },
  },
  {
    _id: getObjectId('option Пасо Роблес'),
    optionsGroupId: getObjectId('optionsGroup Регион'),
    parentId: getObjectId('option Калифорния'),
    nameI18n: {
      ru: 'Пасо Роблес',
    },
  },
  {
    _id: getObjectId('option Франция'),
    optionsGroupId: getObjectId('optionsGroup Регион'),
    nameI18n: {
      ru: 'Франция',
    },
  },
  {
    _id: getObjectId('option Лангедок-Руссийон'),
    optionsGroupId: getObjectId('optionsGroup Регион'),
    parentId: getObjectId('option Франция'),
    nameI18n: {
      ru: 'Лангедок-Руссийон',
    },
  },
  {
    _id: getObjectId('option Австралия'),
    optionsGroupId: getObjectId('optionsGroup Регион'),
    nameI18n: {
      ru: 'Австралия',
    },
  },

  // Объем
  {
    _id: getObjectId('option 300'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    nameI18n: {
      ru: '300',
    },
  },
  {
    _id: getObjectId('option 350'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    nameI18n: {
      ru: '350',
    },
  },
  {
    _id: getObjectId('option 500'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    nameI18n: {
      ru: '500',
    },
  },
  {
    _id: getObjectId('option 750'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    nameI18n: {
      ru: '750',
    },
  },
  {
    _id: getObjectId('option 1000'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    nameI18n: {
      ru: '1000',
    },
  },
  {
    _id: getObjectId('option 1500'),
    optionsGroupId: getObjectId('optionsGroup Объем'),
    nameI18n: {
      ru: '1500',
    },
  },

  // Тип ёмкости
  {
    _id: getObjectId('option Бутылка'),
    optionsGroupId: getObjectId('optionsGroup Тип ёмкости'),
    nameI18n: {
      ru: 'Бутылка',
    },
  },
  {
    _id: getObjectId('option Банка'),
    optionsGroupId: getObjectId('optionsGroup Тип ёмкости'),
    nameI18n: {
      ru: 'Банка',
    },
  },

  // Виноград
  {
    _id: getObjectId('option Бикал'),
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    nameI18n: {
      ru: 'Бикал',
    },
  },
  {
    _id: getObjectId('option Аринту'),
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    nameI18n: {
      ru: 'Аринту',
    },
  },
  {
    _id: getObjectId('option Бага'),
    optionsGroupId: getObjectId('optionsGroup Виноград'),
    nameI18n: {
      ru: 'Бага',
    },
  },

  // Сахар
  {
    _id: getObjectId('option Сухое'),
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    nameI18n: {
      ru: 'Сухое',
    },
  },
  {
    _id: getObjectId('option Сладкое'),
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    nameI18n: {
      ru: 'Сладкое',
    },
  },
  {
    _id: getObjectId('option Полусухое'),
    optionsGroupId: getObjectId('optionsGroup Сахар'),
    nameI18n: {
      ru: 'Полусухое',
    },
  },

  // Тип вина
  {
    _id: getObjectId('option Крепленое'),
    optionsGroupId: getObjectId('optionsGroup Тип вина'),
    color: 'ff0000',
    nameI18n: {
      ru: 'Крепленое',
    },
  },
  {
    _id: getObjectId('option Плодовое'),
    optionsGroupId: getObjectId('optionsGroup Тип вина'),
    color: '29b77a',
    nameI18n: {
      ru: 'Плодовое',
    },
  },
  {
    _id: getObjectId('option Херес'),
    optionsGroupId: getObjectId('optionsGroup Тип вина'),
    color: 'b09030',
    nameI18n: {
      ru: 'Херес',
    },
  },

  // Сочетание
  {
    _id: getObjectId('option Белое мясо'),
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    nameI18n: {
      ru: 'Белое мясо',
    },
  },
  {
    _id: getObjectId('option Дары моря'),
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    nameI18n: {
      ru: 'Дары моря',
    },
  },
  {
    _id: getObjectId('option Суп'),
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    nameI18n: {
      ru: 'Суп',
    },
  },
  {
    _id: getObjectId('option Рыба'),
    optionsGroupId: getObjectId('optionsGroup Сочетание'),
    nameI18n: {
      ru: 'Рыба',
    },
  },

  // Теги
  {
    _id: getObjectId('option Новости'),
    slug: '777',
    optionsGroupId: getObjectId('optionsGroup Теги'),
    nameI18n: {
      ru: 'Новости',
    },
  },
  {
    _id: getObjectId('option Рецепт'),
    slug: '778',
    optionsGroupId: getObjectId('optionsGroup Теги'),
    nameI18n: {
      ru: 'Рецепт',
    },
  },
  {
    _id: getObjectId('option Новинка'),
    slug: '779',
    optionsGroupId: getObjectId('optionsGroup Теги'),
    nameI18n: {
      ru: 'Новинка',
    },
  },

  // Газ
  {
    _id: getObjectId('option С газом'),
    optionsGroupId: getObjectId('optionsGroup Газ'),
    nameI18n: {
      ru: 'С газом',
    },
  },
  {
    _id: getObjectId('option Слабо газированная'),
    optionsGroupId: getObjectId('optionsGroup Газ'),
    nameI18n: {
      ru: 'Слабо газированная',
    },
  },
  {
    _id: getObjectId('option Без газа'),
    optionsGroupId: getObjectId('optionsGroup Газ'),
    nameI18n: {
      ru: 'Без газа',
    },
  },
];

const options: OptionModel[] = [...optionsBase, ...yearOptionsBase()].map((base, i) => {
  return {
    slug: base.slug || addZero(i, ID_COUNTER_DIGITS),
    ...base,
    variants: {},
    ...DEFAULT_COUNTERS_OBJECT,
  };
});

// @ts-ignore
export = options;
