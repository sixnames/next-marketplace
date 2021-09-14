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
import { AttributeInterface, CategoryInterface, OptionInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { get } from 'lodash';

interface TitleOptionInterface
  extends Pick<OptionInterface, 'nameI18n' | 'variants'>,
    Record<any, any> {
  options?: TitleOptionInterface[] | null;
}

interface GetTitleOptionNamesInterface {
  locale: string;
  option: TitleOptionInterface;
  finalGender: string;
  acc: string[];
}

export function getTitleOptionNames({
  finalGender,
  locale,
  option,
  acc,
}: GetTitleOptionNamesInterface): string[] {
  const variant = get(option, `variants.${finalGender}.${locale}`);
  const name = getFieldStringLocale(option.nameI18n, locale);
  const newAcc = [...acc];
  let optionValue = name;
  if (variant) {
    optionValue = variant;
  }
  newAcc.push(optionValue);

  if (!option.options || option.options.length < 1) {
    return newAcc;
  }

  return (option.options || []).reduce((childAcc: string[], childOption) => {
    const childOptionResult = getTitleOptionNames({
      finalGender,
      locale,
      option: childOption,
      acc: [],
    });
    return [...childAcc, ...childOptionResult];
  }, newAcc);
}

interface TitleAttributeInterface extends AttributeInterface, Record<any, any> {}

interface GenerateTitleInterface {
  positionFieldName: 'positioningInTitle' | 'positioningInCardTitle';
  attributeVisibilityFieldName: 'showInCatalogueTitle' | 'showInCardTitle' | 'showInSnippetTitle';
  attributeNameVisibilityFieldName:
    | 'showNameInTitle'
    | 'showNameInCardTitle'
    | 'showNameInSnippetTitle';
  attributes: TitleAttributeInterface[];
  fallbackTitle: string;
  prefix?: string | null;
  defaultKeyword?: string;
  defaultGender: string;
  locale: string;
  currency?: string;
  capitaliseKeyWord?: boolean | null;
  log?: boolean;
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
  attributeVisibilityFieldName,
  attributeNameVisibilityFieldName,
}: GenerateTitleInterface): string {
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
    const { nameI18n, options, capitalise, slug, metric } = attribute;
    const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
    const visible = get(attribute, attributeVisibilityFieldName);
    if (!visible || !options || options.length < 1) {
      return;
    }

    const attributeNameVisibilityField = get(attribute, attributeNameVisibilityFieldName);
    const attributeName = attributeNameVisibilityField
      ? `${getFieldStringLocale(nameI18n, locale)} `
      : '';
    const attributePositionField = get(attribute, positionFieldName);
    const positionInTitleForCurrentLocale = getFieldStringLocale(attributePositionField, locale);

    // attribute metric value
    let metricValue = metric ? ` ${getFieldStringLocale(metric.nameI18n, locale)}` : '';
    if (isPrice && currency) {
      metricValue = currency;
    }

    // collect selected options
    const arrayValue = (options || []).reduce((acc: string[], option) => {
      const optionResult = getTitleOptionNames({
        locale,
        option,
        finalGender,
        acc: [],
      });
      const separator = optionResult.length > 0 && acc.length > 0 ? [titleSeparator] : [];
      return [...acc, ...separator, ...optionResult];
    }, []);
    const initialAttributeValue = `${attributeName.toLowerCase()}${arrayValue.join(
      ' ',
    )}${metricValue}`;
    const value = capitalise ? initialAttributeValue : initialAttributeValue.toLocaleLowerCase();

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

  const firstWordArr = firstWord.split(' ');
  const mainWord = firstWordArr[0];

  // return fallback if no title parts
  if (!mainWord) {
    return fallbackTitle;
  }

  const firstWordOtherWords = firstWordArr.slice(1);
  const otherWords = filteredArray.slice(1);
  return [capitalize(mainWord), ...firstWordOtherWords, ...otherWords].join(' ');
}

interface GenerateProductTitlePrefixInterface {
  locale: string;
  rubricName?: string | null;
  defaultGender: string;
  titleCategoriesSlugs: string[];
  categories?: CategoryInterface[] | null;
  showRubricNameInProductTitle?: boolean | null;
  showCategoryInProductTitle?: boolean | null;
}

export function generateProductTitlePrefix({
  locale,
  rubricName,
  categories,
  defaultGender,
  showCategoryInProductTitle,
  showRubricNameInProductTitle,
  titleCategoriesSlugs,
}: GenerateProductTitlePrefixInterface): string {
  // rubric name as main prefix
  const rubricPrefix = showRubricNameInProductTitle && rubricName ? rubricName : '';
  const categoryNames: string[] = [];

  // category names as secondary prefix
  function getCategoryNames(category: CategoryInterface) {
    const visible = titleCategoriesSlugs.some((slug) => slug === category.slug);
    if (showCategoryInProductTitle) {
      const variant = get(category, `variants.${defaultGender}.${locale}`);
      const name = getFieldStringLocale(category.nameI18n, locale);
      let value = name;
      if (variant) {
        value = variant;
      }
      if (visible) {
        categoryNames.push(value);
      }
      return (category.categories || []).forEach(getCategoryNames);
    }
    return;
  }
  (categories || []).forEach(getCategoryNames);

  const prefixArray = [rubricPrefix, ...categoryNames];
  const filteredArray = prefixArray.filter((word) => word);
  return filteredArray.length > 0 ? capitalize(filteredArray.join(' ')) : '';
}

interface GenerateProductTitleInterface
  extends GenerateProductTitlePrefixInterface,
    Omit<
      GenerateTitleInterface,
      'positionFieldName' | 'prefix' | 'capitaliseKeyWord' | 'attributeNameVisibilityFieldName'
    > {
  attributeVisibilityFieldName: 'showInCardTitle' | 'showInSnippetTitle';
  attributeNameVisibilityFieldName: 'showNameInCardTitle' | 'showNameInSnippetTitle';
}

function generateProductTitle({
  locale,
  rubricName,
  categories,
  showCategoryInProductTitle,
  showRubricNameInProductTitle,
  attributes,
  defaultGender,
  fallbackTitle,
  defaultKeyword,
  currency,
  attributeVisibilityFieldName,
  attributeNameVisibilityFieldName,
  titleCategoriesSlugs,
}: GenerateProductTitleInterface): string {
  const prefix = generateProductTitlePrefix({
    locale,
    rubricName,
    categories,
    defaultGender,
    showCategoryInProductTitle,
    showRubricNameInProductTitle,
    titleCategoriesSlugs,
  });

  return generateTitle({
    attributes,
    defaultGender,
    fallbackTitle,
    defaultKeyword,
    prefix,
    locale,
    currency,
    capitaliseKeyWord: true,
    positionFieldName: 'positioningInCardTitle',
    attributeNameVisibilityFieldName,
    attributeVisibilityFieldName,
  });
}

interface GenerateCardTitleInterface
  extends Omit<
    GenerateProductTitleInterface,
    'attributeNameVisibilityFieldName' | 'attributeVisibilityFieldName'
  > {}

export function generateCardTitle(props: GenerateCardTitleInterface): string {
  return generateProductTitle({
    ...props,
    attributeNameVisibilityFieldName: 'showNameInCardTitle',
    attributeVisibilityFieldName: 'showInCardTitle',
  });
}

export function generateSnippetTitle(props: GenerateCardTitleInterface): string {
  return generateProductTitle({
    ...props,
    attributeNameVisibilityFieldName: 'showNameInSnippetTitle',
    attributeVisibilityFieldName: 'showInSnippetTitle',
  });
}