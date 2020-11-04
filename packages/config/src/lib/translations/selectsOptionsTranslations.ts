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
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
} from '../common';

const selectsOptionsTranslations = {
  selectsOptions: {
    gender: {
      [GENDER_SHE]: {
        ru: 'Женский род',
        en: 'She',
      },
      [GENDER_HE]: {
        ru: 'Мужской род',
        en: 'He',
      },
      [GENDER_IT]: {
        ru: 'Средний род',
        en: 'It',
      },
    },
    attributePositioning: {
      [ATTRIBUTE_POSITION_IN_TITLE_BEGIN]: {
        ru: 'Начало заголовка',
        en: 'In the beginning of title',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD]: {
        ru: 'Перед ключевым словом',
        en: 'Before keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD]: {
        ru: 'Замена ключевого слова',
        en: 'Replace keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD]: {
        ru: 'После ключевого слова',
        en: 'After keyword',
      },
      [ATTRIBUTE_POSITION_IN_TITLE_END]: {
        ru: 'Конец заголовка',
        en: 'In the end of title',
      },
    },
    attributeView: {
      [ATTRIBUTE_VIEW_VARIANT_LIST]: {
        ru: 'Список',
        en: 'In list',
      },
      [ATTRIBUTE_VIEW_VARIANT_TEXT]: {
        ru: 'Текст',
        en: 'As text',
      },
      [ATTRIBUTE_VIEW_VARIANT_TAG]: {
        ru: 'Тег',
        en: 'As tag',
      },
      [ATTRIBUTE_VIEW_VARIANT_ICON]: {
        ru: 'С иконкой',
        en: 'With icon',
      },
    },
  },
};

export default selectsOptionsTranslations;
