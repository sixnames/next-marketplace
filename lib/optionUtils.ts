import trim from 'trim';
import { ALL_ALPHABETS, GENDER_ENUMS, GENDER_HE } from '../config/common';
import { AlphabetListModelType, OptionVariantsModel, TranslationModel } from '../db/dbModels';
import { OptionInterface } from '../db/uiInterfaces';
import { getFieldStringLocale, trimTranslationField } from './i18n';
import { noNaN } from './numbers';

export interface GetStringValueFromOptionsList {
  options: OptionInterface[];
  locale: string;
  metricName?: string;
  gender?: string;
}

export function getStringValueFromOptionsList({
  options,
  locale,
  metricName,
  gender = GENDER_HE,
}: GetStringValueFromOptionsList): string {
  if (options.length < 1) {
    return '';
  }

  const names: string[] = [];

  function iter(option?: OptionInterface) {
    if (!option) {
      return;
    }
    const name =
      option.variants[gender] && option.variants[gender][locale]
        ? getFieldStringLocale(option.variants[gender], locale)
        : getFieldStringLocale(option.nameI18n, locale);
    if (name) {
      names.push(name);
    }

    if (option.options) {
      return option.options.forEach(iter);
    }
  }

  options.forEach(iter);

  /*options.forEach((option) => {
    const name =
      option.variants[gender] && option.variants[gender][locale]
        ? getFieldStringLocale(option.variants[gender], locale)
        : getFieldStringLocale(option.nameI18n, locale);
    if (name) {
      names.push(name);
    }
  });*/
  /*if (names.length > 0) {
    console.log(names);
  }*/
  const asString = names.join(', ');

  return `${asString}${metricName}`;
}

export interface FindOptionInGroupInterface {
  options: OptionInterface[];
  condition: (treeOption: OptionInterface) => boolean;
}

export function findOptionInTree({
  options,
  condition,
}: FindOptionInGroupInterface): OptionInterface | null | undefined {
  let option: OptionInterface | null | undefined = null;
  options.forEach((treeOption) => {
    if (option) {
      return;
    }

    if ((treeOption.options || []).length > 0) {
      option = findOptionInTree({ options: treeOption.options || [], condition });
    }

    if (!option && condition(treeOption)) {
      option = treeOption;
    }
  });
  return option;
}

interface GetAlphabetListInterface<TModel> {
  entityList: TModel[];
  locale: string;
}

export function getAlphabetList<TModel extends Record<string, any>>({
  entityList,
  locale,
}: GetAlphabetListInterface<TModel>) {
  function getOptionName(option: TModel) {
    return trim(getFieldStringLocale(option.nameI18n, locale));
  }

  const countOptionNames = entityList.reduce((acc: number, option) => {
    return acc + noNaN(getOptionName(option));
  }, 0);
  const isNumber = countOptionNames > 0;

  const payload: AlphabetListModelType<TModel>[] = [];
  ALL_ALPHABETS.forEach((letter) => {
    const realLetter = letter.toLowerCase();
    const docs = entityList.filter((option) => {
      const optionName = getOptionName(option).charAt(0).toLowerCase();
      return realLetter === optionName;
    });

    const sortedDocs = docs.sort((a, b) => {
      if (isNumber) {
        return noNaN(getOptionName(a)) - noNaN(getOptionName(b));
      }

      const aName = getOptionName(a);
      const bName = getOptionName(b);
      return aName.localeCompare(bName);
    });

    if (docs.length > 0) {
      payload.push({
        letter: letter.toLocaleUpperCase(),
        docs: sortedDocs,
      });
    }
  });

  return payload;
}

interface TrimOptionNamesInterface {
  nameI18n: TranslationModel;
  variants: OptionVariantsModel;
}

export function trimOptionNames(props: TrimOptionNamesInterface): TrimOptionNamesInterface {
  const variants = GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
    const genderTranslation = props.variants[gender];
    if (!genderTranslation) {
      acc[gender] = {};
      return acc;
    }
    acc[gender] = trimTranslationField(genderTranslation);
    return acc;
  }, {});

  return {
    nameI18n: trimTranslationField(props.nameI18n),
    variants,
  };
}
