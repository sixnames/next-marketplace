import capitalize from 'capitalize';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  PRICE_ATTRIBUTE_SLUG,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { GenderModel, RubricCatalogueTitleModel } from 'db/dbModels';
import { SelectedFilterInterface } from 'lib/catalogueUtils';
import { getFieldStringLocale } from 'lib/i18n';

interface GenerateTitleInterface {
  selectedFilters: SelectedFilterInterface[];
  rubricCatalogueTitleConfig: RubricCatalogueTitleModel;
  locale: string;
  currency?: string;
  capitaliseKeyWord?: boolean | null;
}

export function generateTitle({
  selectedFilters,
  rubricCatalogueTitleConfig,
  locale,
  currency,
  capitaliseKeyWord,
}: GenerateTitleInterface): string {
  const {
    gender: defaultGender,
    defaultTitleI18n,
    keywordI18n,
    prefixI18n,
  } = rubricCatalogueTitleConfig;

  function castArrayToTitle(arr: any[]): string {
    const filteredArray = arr.filter((word) => word);
    const firstWord = filteredArray[0];
    const otherWords = filteredArray.slice(1);
    return [capitalize(firstWord), ...otherWords].join(' ');
  }

  // Return default rubric title if no filters selected
  if (selectedFilters.length < 1) {
    return getFieldStringLocale(defaultTitleI18n, locale);
  }

  const titleSeparator = getConstantTranslation(`catalogueTitleSeparator.${locale}`);
  const rubricKeywordTranslation = getFieldStringLocale(keywordI18n, locale);
  const rubricKeyword =
    rubricKeywordTranslation === LOCALE_NOT_FOUND_FIELD_MESSAGE
      ? ''
      : capitaliseKeyWord
      ? rubricKeywordTranslation
      : rubricKeywordTranslation.toLowerCase();

  const finalPrefixTranslation = getFieldStringLocale(prefixI18n, locale);
  const finalPrefix =
    finalPrefixTranslation === LOCALE_NOT_FOUND_FIELD_MESSAGE ? '' : finalPrefixTranslation;

  const beginOfTitle: string[] = [];
  const beforeKeyword: string[] = [];
  const afterKeyword: string[] = [];
  const endOfTitle: string[] = [];
  let finalKeyword = rubricKeyword;
  let finalGender = defaultGender;

  // Set keyword gender
  selectedFilters.forEach((selectedFilter) => {
    const { attribute, options } = selectedFilter;
    const { positioningInTitle } = attribute;
    const positionInTitleForCurrentLocale = getFieldStringLocale(positioningInTitle, locale);
    const gendersList = options.reduce((genderAcc: GenderModel[], { gender }) => {
      if (
        gender &&
        positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD
      ) {
        return [...genderAcc, gender];
      }
      return genderAcc;
    }, []);

    if (gendersList.length > 0 && gendersList[0]) {
      finalGender = gendersList[0];
    }
  });

  // Collect title parts
  selectedFilters.forEach((selectedFilter) => {
    const { attribute, options } = selectedFilter;
    const isPrice = attribute.slug === PRICE_ATTRIBUTE_SLUG;
    const { positioningInTitle, metric, showNameInTitle } = attribute;
    const attributeName = showNameInTitle
      ? `${getFieldStringLocale(attribute.nameI18n, locale)} `
      : '';
    const positionInTitleForCurrentLocale = getFieldStringLocale(positioningInTitle, locale);
    let metricValue = metric ? ` ${getFieldStringLocale(metric.nameI18n, locale)}` : '';
    if (isPrice && currency) {
      metricValue = currency;
    }

    const value = options
      .map(({ variants, nameI18n }) => {
        const name = getFieldStringLocale(nameI18n, locale);
        const currentVariant = variants[finalGender];
        const variantLocale = currentVariant ? getFieldStringLocale(currentVariant, locale) : null;
        let value = name;
        if (variantLocale && variantLocale !== LOCALE_NOT_FOUND_FIELD_MESSAGE) {
          value = variantLocale;
        }
        const optionValue = `${attributeName}${value}${metricValue}`;
        return attribute.capitalise ? optionValue : optionValue.toLocaleLowerCase();
      })
      .join(titleSeparator);

    if (isPrice) {
      endOfTitle.push(value);
      return;
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEGIN) {
      beginOfTitle.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD) {
      beforeKeyword.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
      const keywordValue = capitaliseKeyWord ? value : value.toLowerCase();
      if (finalKeyword === rubricKeyword) {
        finalKeyword = keywordValue;
      } else {
        finalKeyword = finalKeyword + titleSeparator + keywordValue;
      }
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD) {
      afterKeyword.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_END) {
      endOfTitle.push(value);
    }
  });

  return castArrayToTitle([
    finalPrefix,
    ...beginOfTitle,
    ...beforeKeyword,
    finalKeyword,
    ...afterKeyword,
    ...endOfTitle,
  ]);
}
