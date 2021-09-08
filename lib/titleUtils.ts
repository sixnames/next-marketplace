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
  metricValue: string;
  capitalise?: boolean | null;
  finalGender: string;
  acc: string;
}

export function getTitleOptionNames({
  capitalise,
  finalGender,
  locale,
  metricValue,
  option,
  acc,
}: GetTitleOptionNamesInterface): string {
  const variant = get(option, `variants.${finalGender}.${locale}`);
  const name = getFieldStringLocale(option.nameI18n, locale);
  let newAcc = `${acc} ${name}`;
  if (variant) {
    newAcc = `${acc} ${variant}`;
  }

  if (!option.options || option.options.length < 1) {
    const optionValue = `${newAcc}${metricValue}`;
    return capitalise ? optionValue : optionValue.toLocaleLowerCase();
  }

  return (option.options || []).reduce((childAcc: string, childOption) => {
    const childOptionName = getTitleOptionNames({
      capitalise,
      finalGender,
      locale,
      metricValue,
      option: childOption,
      acc,
    });
    return `${childAcc} ${childOptionName}`;
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
}: // log,
GenerateTitleInterface): string {
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
    if (!visible) {
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
    /*const arrayValue = (options || []).map((option) => {
      return getTitleOptionNames({
        locale,
        option,
        metricValue,
        capitalise,
        finalGender,
        acc: '',
      });
    });
    console.log(arrayValue);*/

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

interface GenerateProductTitlePrefixInterface {
  locale: string;
  rubricName?: string | null;
  defaultGender: string;
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
}: GenerateProductTitlePrefixInterface): string {
  // rubric name as main prefix
  const rubricPrefix = showRubricNameInProductTitle && rubricName ? rubricName : '';
  const categoryNames: string[] = [];

  // category names as secondary prefix
  function getCategoryNames(category: CategoryInterface) {
    if (showCategoryInProductTitle) {
      const variant = get(category, `variants.${defaultGender}.${locale}`);
      const name = getFieldStringLocale(category.nameI18n, locale);
      if (variant) {
        categoryNames.push(variant);
      } else {
        categoryNames.push(name);
      }
      return (category.categories || []).forEach(getCategoryNames);
    }
    return;
  }
  (categories || []).forEach(getCategoryNames);

  const prefixArray = [rubricPrefix, ...categoryNames];
  const filteredArray = prefixArray.filter((word) => word);
  return filteredArray.join(' ');
}

interface GenerateProductTitleInterface
  extends GenerateProductTitlePrefixInterface,
    Omit<GenerateTitleInterface, 'positionFieldName' | 'prefix' | 'capitaliseKeyWord'> {
  attributeVisibilityFieldName: 'showInCardTitle' | 'showInSnippetTitle';
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
}: GenerateProductTitleInterface): string {
  const prefix = generateProductTitlePrefix({
    locale,
    rubricName,
    categories,
    defaultGender,
    showCategoryInProductTitle,
    showRubricNameInProductTitle,
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
