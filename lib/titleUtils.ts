import capitalize from 'capitalize';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  GENDER_IT,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  PRICE_ATTRIBUTE_SLUG,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { GenderModel } from 'db/dbModels';
import { AttributeInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { get } from 'lodash';

interface TitleAttributeInterface extends AttributeInterface, Record<any, any> {}

interface GenerateTitleInterface {
  positionFieldName: 'positioningInTitle' | 'positioningCardInTitle';
  attributes: TitleAttributeInterface[];
  fallbackTitle: string;
  prefix?: string | null;
  defaultKeyword?: string;
  defaultGender?: string;
  locale: string;
  currency?: string;
  capitaliseKeyWord?: boolean | null;
}

export function generateTitle({
  attributes,
  defaultGender = GENDER_IT,
  fallbackTitle,
  defaultKeyword,
  prefix,
  locale,
  currency,
  capitaliseKeyWord,
  positionFieldName,
}: GenerateTitleInterface): string {
  // return default title if no filters selected
  if (attributes.length < 1) {
    return fallbackTitle;
  }

  // get title attributes separator
  const titleSeparator = getConstantTranslation(`catalogueTitleSeparator.${locale}`);

  // get initial keyword
  const initialKeyword =
    defaultKeyword === LOCALE_NOT_FOUND_FIELD_MESSAGE
      ? ''
      : capitaliseKeyWord
      ? defaultKeyword
      : `${defaultKeyword}`.toLowerCase();

  // get title prefix
  const finalPrefix = prefix === LOCALE_NOT_FOUND_FIELD_MESSAGE ? '' : prefix;

  // title initial parts
  const beginOfTitle: string[] = [];
  const beforeKeyword: string[] = [];
  const afterKeyword: string[] = [];
  const endOfTitle: string[] = [];

  // set initial variables
  let finalKeyword = initialKeyword;
  let finalGender = defaultGender;

  // set final gender
  attributes.forEach((attribute) => {
    const { options } = attribute;
    const attributePositionField = get(attribute, positionFieldName);
    const positionInTitleForCurrentLocale = getFieldStringLocale(attributePositionField, locale);
    const gendersList = (options || []).reduce((genderAcc: GenderModel[], { gender }) => {
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

  // collect title parts
  attributes.forEach((attribute) => {
    const { nameI18n, options, capitalise, slug, positioningInTitle, metric, showNameInTitle } =
      attribute;
    const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
    const attributeName = showNameInTitle ? `${getFieldStringLocale(nameI18n, locale)} ` : '';
    const positionInTitleForCurrentLocale = getFieldStringLocale(positioningInTitle, locale);

    // attribute metric value
    let metricValue = metric ? ` ${getFieldStringLocale(metric.nameI18n, locale)}` : '';
    if (isPrice && currency) {
      metricValue = currency;
    }

    // collect selected options
    const value = (options || [])
      .map(({ variants, nameI18n }) => {
        const name = getFieldStringLocale(nameI18n, locale);
        const currentVariant = variants[finalGender];
        const variantLocale = currentVariant ? getFieldStringLocale(currentVariant, locale) : null;
        let value = name;
        if (variantLocale && variantLocale !== LOCALE_NOT_FOUND_FIELD_MESSAGE) {
          value = variantLocale;
        }
        const optionValue = `${attributeName}${value}${metricValue}`;
        return capitalise ? optionValue : optionValue.toLocaleLowerCase();
      })
      .join(titleSeparator);

    // price
    if (isPrice) {
      endOfTitle.push(value);
      return;
    }

    // begin
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEGIN) {
      beginOfTitle.push(value);
    }

    // before keyword
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD) {
      beforeKeyword.push(value);
    }

    // replace keyword
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
      const keywordValue = capitaliseKeyWord ? value : value.toLowerCase();
      if (finalKeyword === initialKeyword) {
        finalKeyword = keywordValue;
      } else {
        finalKeyword = finalKeyword + titleSeparator + keywordValue;
      }
    }

    // after keyword
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD) {
      afterKeyword.push(value);
    }

    // end
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_END) {
      endOfTitle.push(value);
    }
  });

  // cast title parts to string
  const titleFinalArray = [
    finalPrefix,
    ...beginOfTitle,
    ...beforeKeyword,
    finalKeyword,
    ...afterKeyword,
    ...endOfTitle,
  ];

  const filteredArray = titleFinalArray.filter((word) => word);
  const firstWord = filteredArray[0];

  // return fallback if no title parts
  if (!firstWord) {
    return fallbackTitle;
  }

  const otherWords = filteredArray.slice(1);
  return [capitalize(firstWord), ...otherWords].join(' ');
}
