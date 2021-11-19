import capitalize from 'capitalize';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  GENDER_IT,
  FILTER_PRICE_KEY,
  FILTER_CATEGORY_KEY,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { GenderModel } from 'db/dbModels';
import {
  AttributeInterface,
  BrandInterface,
  CategoryInterface,
  OptionInterface,
  ProductAttributeInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { get } from 'lodash';
import trim from 'trim';

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
  isCategory: boolean;
  categories?: CategoryInterface[] | null;
}

export function getTitleOptionNames({
  finalGender,
  locale,
  option,
  acc,
  isCategory,
  categories,
}: GetTitleOptionNamesInterface): string[] {
  const variant = get(option, `variants.${finalGender}.${locale}`);
  const name = getFieldStringLocale(option.nameI18n, locale);
  const childOptions = option.options || [];
  let newAcc = [...acc];
  let optionValue = name;
  if (variant) {
    optionValue = variant;
  }

  if (isCategory) {
    const childSlugs = childOptions.map(({ slug }) => slug);
    const childCategories = (categories || []).filter(({ slug }) => {
      return childSlugs.includes(slug);
    });
    const skipParentName = childCategories.some(({ replaceParentNameInCatalogueTitle }) => {
      return replaceParentNameInCatalogueTitle;
    });
    if (!skipParentName) {
      newAcc.push(optionValue);
    }
  } else {
    newAcc.push(optionValue);
  }

  return childOptions.reduce((childAcc: string[], childOption) => {
    const childOptionResult = getTitleOptionNames({
      finalGender,
      locale,
      option: childOption,
      acc: [],
      isCategory,
      categories,
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
  attributes?: TitleAttributeInterface[] | null;
  fallbackTitle: string;
  prefix?: string | null;
  defaultKeyword?: string;
  defaultGender: string;
  locale: string;
  currency?: string;
  capitaliseKeyWord?: boolean | null;
  categories?: CategoryInterface[] | null;
  log?: boolean;
  page?: number;
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
  categories,
  page,
}: GenerateTitleInterface): string {
  // get title attributes separator
  const titleSeparator = getConstantTranslation(`catalogueTitleSeparator.${locale}`);
  const pageName = getConstantTranslation(`pagination.page.${locale}`);
  const pagePostfix = page && page > 1 ? `. ${pageName} - ${page}` : '';

  // get initial keyword
  const initialKeyword = !defaultKeyword
    ? ''
    : capitaliseKeyWord
    ? defaultKeyword
    : `${defaultKeyword}`.toLowerCase();

  // get title prefix
  const finalPrefix = prefix || '';

  // title initial parts
  const beginOfTitle: string[] = [];
  const beforeKeyword: string[] = [];
  const afterKeyword: string[] = [];
  const endOfTitle: string[] = [];

  // set initial variables
  let finalKeyword = initialKeyword || fallbackTitle;
  let finalGender = defaultGender;

  // set final gender
  (attributes || []).forEach((attribute) => {
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
  (attributes || []).forEach((attribute) => {
    const { nameI18n, options, capitalise, slug, metric } = attribute;
    const isPrice = slug === FILTER_PRICE_KEY;
    const isCategory = slug === FILTER_CATEGORY_KEY;
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
        isCategory,
        categories,
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

  // get parts
  const beginOfTitleArray = [finalPrefix, ...beginOfTitle, ...beforeKeyword];
  const filteredBeginOfTitleArray = beginOfTitleArray.filter((word) => word);

  const endOfTitleArray = [...afterKeyword, ...endOfTitle];
  const filteredEndOfTitleArray = endOfTitleArray.filter((word) => word);

  // cast title parts to string
  const beginOfTitleString = filteredBeginOfTitleArray.join(', ');
  const endOfTitleString = filteredEndOfTitleArray.join(', ');
  const titleString = trim(`${beginOfTitleString} ${finalKeyword} ${endOfTitleString}`);
  const titleWordsArray = titleString.split(' ');
  const firstWord = titleWordsArray[0];

  // return fallback if no title parts
  if (!firstWord) {
    return fallbackTitle;
  }

  const capitalizedFirstWord = capitalize(firstWord);
  const otherWords = titleWordsArray.slice(1);
  const otherWordsString = otherWords.length > 0 ? ` ${otherWords.join(' ')}` : '';
  return `${capitalizedFirstWord}${otherWordsString}${pagePostfix}`;
}

interface GenerateProductTitlePrefixInterface {
  locale: string;
  brand?: BrandInterface | null;
  rubricName?: string | null;
  defaultGender: string;
  titleCategoriesSlugs?: string[] | null;
  categories?: CategoryInterface[] | null;
  showRubricNameInProductTitle?: boolean | null;
  showCategoryInProductTitle?: boolean | null;
  brandVisibilityFieldName: string;
}

export function generateProductTitlePrefix({
  locale,
  rubricName,
  categories,
  brand,
  defaultGender,
  showCategoryInProductTitle,
  showRubricNameInProductTitle,
  titleCategoriesSlugs,
  brandVisibilityFieldName,
}: GenerateProductTitlePrefixInterface): string {
  // rubric name as main prefix
  const rubricPrefix = showRubricNameInProductTitle && rubricName ? rubricName : '';
  const categoryNames: string[] = [];

  // category names as secondary prefix
  function getCategoryNames(category: CategoryInterface) {
    const visible = (titleCategoriesSlugs || []).some((slug) => slug === category.slug);
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

  const isBrandVisible = get(brand, brandVisibilityFieldName);
  const brandName = isBrandVisible ? getFieldStringLocale(brand?.nameI18n, locale) : '';
  const collectionNames = (brand?.collections || [])
    .reduce((acc: string[], collection) => {
      const isCollectionVisible = get(collection, brandVisibilityFieldName);
      if (!isBrandVisible || !isCollectionVisible) {
        return acc;
      }
      const collectionName = getFieldStringLocale(collection?.nameI18n, locale) || '';
      return [...acc, collectionName];
    }, [])
    .join(' ');

  const prefixArray = [rubricPrefix, ...categoryNames];
  const filteredArray = prefixArray.filter((word) => word);
  const prefix = filteredArray.length > 0 ? capitalize(filteredArray.join(' ')) : '';
  return `${prefix}${brandName ? ` ${brandName}` : ''}${
    collectionNames ? ` ${collectionNames}` : ''
  }`;
}

interface GenerateProductTitleInterface
  extends GenerateProductTitlePrefixInterface,
    Omit<
      GenerateTitleInterface,
      | 'positionFieldName'
      | 'prefix'
      | 'capitaliseKeyWord'
      | 'attributeNameVisibilityFieldName'
      | 'fallbackTitle'
      | 'defaultKeyword'
    > {
  attributeVisibilityFieldName: 'showInCardTitle' | 'showInSnippetTitle';
  attributeNameVisibilityFieldName: 'showNameInCardTitle' | 'showNameInSnippetTitle';
  originalName: string;
}

function generateProductTitle({
  locale,
  rubricName,
  categories,
  showCategoryInProductTitle,
  showRubricNameInProductTitle,
  attributes,
  defaultGender,
  originalName,
  currency,
  attributeVisibilityFieldName,
  attributeNameVisibilityFieldName,
  titleCategoriesSlugs,
  brandVisibilityFieldName,
  brand,
}: GenerateProductTitleInterface): string {
  const prefix = generateProductTitlePrefix({
    brand,
    locale,
    rubricName,
    categories,
    defaultGender,
    showCategoryInProductTitle,
    showRubricNameInProductTitle,
    titleCategoriesSlugs,
    brandVisibilityFieldName,
  });

  return generateTitle({
    attributes,
    defaultGender,
    fallbackTitle: originalName,
    defaultKeyword: originalName,
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
    | 'attributes'
    | 'attributeNameVisibilityFieldName'
    | 'attributeVisibilityFieldName'
    | 'brandVisibilityFieldName'
  > {
  attributes?: ProductAttributeInterface[] | null;
}

export function generateCardTitle(props: GenerateCardTitleInterface): string {
  return generateProductTitle({
    ...props,
    attributes: (props.attributes || []).reduce((acc: TitleAttributeInterface[], { attribute }) => {
      if (attribute) {
        return [...acc, attribute];
      }
      return acc;
    }, []),
    brandVisibilityFieldName: 'showInCardTitle',
    attributeNameVisibilityFieldName: 'showNameInCardTitle',
    attributeVisibilityFieldName: 'showInCardTitle',
  });
}

export function generateSnippetTitle(props: GenerateCardTitleInterface): string {
  return generateProductTitle({
    ...props,
    attributes: (props.attributes || []).reduce((acc: TitleAttributeInterface[], { attribute }) => {
      if (attribute) {
        return [...acc, attribute];
      }
      return acc;
    }, []),
    brandVisibilityFieldName: 'showInSnippetTitle',
    attributeNameVisibilityFieldName: 'showNameInSnippetTitle',
    attributeVisibilityFieldName: 'showInSnippetTitle',
  });
}
