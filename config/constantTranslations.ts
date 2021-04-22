import { get } from 'lodash';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_VIEW_VARIANT_ICON,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_TAG,
  ATTRIBUTE_VIEW_VARIANT_TEXT,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  DEFAULT_LOCALE,
  SECONDARY_LOCALE,
  OPTIONS_GROUP_VARIANT_TEXT,
  OPTIONS_GROUP_VARIANT_ICON,
  OPTIONS_GROUP_VARIANT_COLOR,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VARIANT_NUMBER,
} from './common';

export const constantTranslations = {
  messages: {
    error: {
      [DEFAULT_LOCALE]: 'Что-то пошло не так. Попробуйте ещё раз.',
      [SECONDARY_LOCALE]: 'Something went wrong. Please try again.',
    },
    dataError: {
      [DEFAULT_LOCALE]: 'Ошибка загрузки данных.',
      [SECONDARY_LOCALE]: 'Data loading error.',
    },
  },
  breadcrumbs: {
    main: {
      [DEFAULT_LOCALE]: 'Главная',
      [SECONDARY_LOCALE]: 'Main',
    },
  },
  catalogueTitleSeparator: {
    [DEFAULT_LOCALE]: ' или ',
    [SECONDARY_LOCALE]: ' or ',
  },
  catalogueFilter: {
    brands: {
      [DEFAULT_LOCALE]: 'Бренды',
      [SECONDARY_LOCALE]: 'Brands',
    },
    brandCollections: {
      [DEFAULT_LOCALE]: 'Линейки бренда',
      [SECONDARY_LOCALE]: 'Brand collections',
    },
    manufacturers: {
      [DEFAULT_LOCALE]: 'Производители',
      [SECONDARY_LOCALE]: 'Manufacturers',
    },
  },
  selectsOptions: {
    gender: {
      [GENDER_SHE]: {
        [DEFAULT_LOCALE]: 'Женский род',
        [SECONDARY_LOCALE]: 'She',
      },
      [GENDER_HE]: {
        [DEFAULT_LOCALE]: 'Мужской род',
        [SECONDARY_LOCALE]: 'He',
      },
      [GENDER_IT]: {
        [DEFAULT_LOCALE]: 'Средний род',
        [SECONDARY_LOCALE]: 'It',
      },
    },
    attributeVariants: {
      [ATTRIBUTE_VARIANT_SELECT]: {
        [DEFAULT_LOCALE]: 'Селект',
        [SECONDARY_LOCALE]: 'Select',
      },
      [ATTRIBUTE_VARIANT_MULTIPLE_SELECT]: {
        [DEFAULT_LOCALE]: 'Мульти-селект',
        [SECONDARY_LOCALE]: 'Multi-select',
      },
      [ATTRIBUTE_VARIANT_STRING]: {
        [DEFAULT_LOCALE]: 'Строка',
        [SECONDARY_LOCALE]: 'String',
      },
      [ATTRIBUTE_VARIANT_NUMBER]: {
        [DEFAULT_LOCALE]: 'Число',
        [SECONDARY_LOCALE]: 'Number',
      },
    },
    attributeVariantsPlural: {
      [ATTRIBUTE_VARIANT_SELECT]: {
        [DEFAULT_LOCALE]: 'Селекты',
        [SECONDARY_LOCALE]: 'Selects',
      },
      [ATTRIBUTE_VARIANT_MULTIPLE_SELECT]: {
        [DEFAULT_LOCALE]: 'Мульти-селекты',
        [SECONDARY_LOCALE]: 'Multi-selects',
      },
      [ATTRIBUTE_VARIANT_STRING]: {
        [DEFAULT_LOCALE]: 'Текстовые',
        [SECONDARY_LOCALE]: 'Strings',
      },
      [ATTRIBUTE_VARIANT_NUMBER]: {
        [DEFAULT_LOCALE]: 'Числовые',
        [SECONDARY_LOCALE]: 'Numbers',
      },
    },
    attributePositioning: {
      [ATTRIBUTE_POSITION_IN_TITLE_BEGIN]: {
        [DEFAULT_LOCALE]: 'Начало заголовка',
        [SECONDARY_LOCALE]: 'In the beginning of title',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD]: {
        [DEFAULT_LOCALE]: 'Перед ключевым словом',
        [SECONDARY_LOCALE]: 'Before keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD]: {
        [DEFAULT_LOCALE]: 'Замена ключевого слова',
        [SECONDARY_LOCALE]: 'Replace keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD]: {
        [DEFAULT_LOCALE]: 'После ключевого слова',
        [SECONDARY_LOCALE]: 'After keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_END]: {
        [DEFAULT_LOCALE]: 'Конец заголовка',
        [SECONDARY_LOCALE]: 'In the end of title',
      },
    },
    attributeView: {
      [ATTRIBUTE_VIEW_VARIANT_LIST]: {
        [DEFAULT_LOCALE]: 'Список',
        [SECONDARY_LOCALE]: 'In list',
      },
      [ATTRIBUTE_VIEW_VARIANT_TEXT]: {
        [DEFAULT_LOCALE]: 'Текст',
        [SECONDARY_LOCALE]: 'As text',
      },
      [ATTRIBUTE_VIEW_VARIANT_TAG]: {
        [DEFAULT_LOCALE]: 'Тег',
        [SECONDARY_LOCALE]: 'As tag',
      },
      [ATTRIBUTE_VIEW_VARIANT_ICON]: {
        [DEFAULT_LOCALE]: 'С иконкой',
        [SECONDARY_LOCALE]: 'With icon',
      },
      [ATTRIBUTE_VIEW_VARIANT_OUTER_RATING]: {
        [DEFAULT_LOCALE]: 'Внешний рейтинг',
        [SECONDARY_LOCALE]: 'As outer rating',
      },
    },
    optionsGroupVariant: {
      [OPTIONS_GROUP_VARIANT_TEXT]: {
        [DEFAULT_LOCALE]: 'Текст',
        [SECONDARY_LOCALE]: 'Text',
      },
      [OPTIONS_GROUP_VARIANT_ICON]: {
        [DEFAULT_LOCALE]: 'С иконкой',
        [SECONDARY_LOCALE]: 'With icon',
      },
      [OPTIONS_GROUP_VARIANT_COLOR]: {
        [DEFAULT_LOCALE]: 'С цветом',
        [SECONDARY_LOCALE]: 'With color',
      },
    },
  },
};

export const getFieldTranslation = (path: string): string => {
  return `${get(constantTranslations, path)}`;
};
