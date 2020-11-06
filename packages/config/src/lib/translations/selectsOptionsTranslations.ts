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
  DEFAULT_LANG,
  SECONDARY_LANG,
} from '../common';

const selectsOptionsTranslations = {
  selectsOptions: {
    gender: {
      [GENDER_SHE]: {
        [DEFAULT_LANG]: 'Женский род',
        [SECONDARY_LANG]: 'She',
      },
      [GENDER_HE]: {
        [DEFAULT_LANG]: 'Мужской род',
        [SECONDARY_LANG]: 'He',
      },
      [GENDER_IT]: {
        [DEFAULT_LANG]: 'Средний род',
        [SECONDARY_LANG]: 'It',
      },
    },
    attributePositioning: {
      [ATTRIBUTE_POSITION_IN_TITLE_BEGIN]: {
        [DEFAULT_LANG]: 'Начало заголовка',
        [SECONDARY_LANG]: 'In the beginning of title',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD]: {
        [DEFAULT_LANG]: 'Перед ключевым словом',
        [SECONDARY_LANG]: 'Before keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD]: {
        [DEFAULT_LANG]: 'Замена ключевого слова',
        [SECONDARY_LANG]: 'Replace keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD]: {
        [DEFAULT_LANG]: 'После ключевого слова',
        [SECONDARY_LANG]: 'After keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_END]: {
        [DEFAULT_LANG]: 'Конец заголовка',
        [SECONDARY_LANG]: 'In the end of title',
      },
    },
    attributeView: {
      [ATTRIBUTE_VIEW_VARIANT_LIST]: {
        [DEFAULT_LANG]: 'Список',
        [SECONDARY_LANG]: 'In list',
      },
      [ATTRIBUTE_VIEW_VARIANT_TEXT]: {
        [DEFAULT_LANG]: 'Текст',
        [SECONDARY_LANG]: 'As text',
      },
      [ATTRIBUTE_VIEW_VARIANT_TAG]: {
        [DEFAULT_LANG]: 'Тег',
        [SECONDARY_LANG]: 'As tag',
      },
      [ATTRIBUTE_VIEW_VARIANT_ICON]: {
        [DEFAULT_LANG]: 'С иконкой',
        [SECONDARY_LANG]: 'With icon',
      },
      [ATTRIBUTE_VIEW_VARIANT_OUTER_RATING]: {
        [DEFAULT_LANG]: 'Внешний рейтинг',
        [SECONDARY_LANG]: 'As outer rating',
      },
    },
  },
};

export default selectsOptionsTranslations;
