import { COL_PRODUCTS } from 'db/collectionNames';
import {
  AttributeModel,
  CatalogueFilterAttributeModel,
  CatalogueFilterAttributeOptionModel,
  GenderModel,
  ObjectIdModel,
  OptionModel,
  ProductModel,
  RubricAttributeModel,
  RubricCatalogueTitleModel,
  RubricOptionModel,
} from 'db/dbModels';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  CATALOGUE_OPTION_SEPARATOR,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  PRICE_ATTRIBUTE_SLUG,
} from 'config/common';
import capitalize from 'capitalize';
import { getDatabase } from 'db/mongodb';
import { noNaN } from 'lib/numbers';
import { GetFieldLocaleType } from 'lib/sessionHelpers';
import { getFieldTranslation } from 'config/constantTranslations';

export interface CastCatalogueParamToObjectPayloadInterface {
  slug: string;
  value: string;
}

export function castCatalogueParamToObject(
  param: string,
): CastCatalogueParamToObjectPayloadInterface {
  const paramArray = param.split('-');
  const slug = `${paramArray[0]}`;
  const value = `${paramArray[1]}`;
  return {
    slug,
    value,
  };
}

export interface SelectedFilterInterface {
  attribute: AttributeModel;
  options: OptionModel[];
}

interface GetCatalogueTitleInterface {
  selectedFilters: SelectedFilterInterface[];
  getFieldLocale: GetFieldLocaleType;
  catalogueTitle: RubricCatalogueTitleModel;
  locale: string;
}

export function getCatalogueTitle({
  selectedFilters,
  catalogueTitle,
  getFieldLocale,
  locale,
}: GetCatalogueTitleInterface): string {
  const { gender: rubricGender, defaultTitleI18n, keywordI18n, prefixI18n } = catalogueTitle;

  // Return default rubric title if no filters selected
  if (selectedFilters.length < 1) {
    return getFieldLocale(defaultTitleI18n);
  }

  const titleSeparator = getFieldTranslation(`catalogueTitleSeparator.${locale}`);
  const rubricKeyword = getFieldLocale(keywordI18n);
  const finalPrefix = prefixI18n ? getFieldLocale(prefixI18n) : '';
  const beginOfTitle: string[] = [];
  const beforeKeyword: string[] = [];
  const afterKeyword: string[] = [];
  const endOfTitle: string[] = [];
  let finalKeyword = rubricKeyword;
  let finalGender = rubricGender;

  // Set keyword gender
  selectedFilters.forEach((selectedFilter) => {
    const { attribute, options } = selectedFilter;
    const { positioningInTitle } = attribute;
    const positionInTitleForCurrentLocale = getFieldLocale(positioningInTitle);
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
    const { positioningInTitle } = attribute;
    const positionInTitleForCurrentLocale = getFieldLocale(positioningInTitle);

    const value = options
      .map(({ variants, nameI18n }) => {
        const name = getFieldLocale(nameI18n);
        const currentVariant = variants[finalGender];
        const variantLocale = currentVariant ? getFieldLocale(currentVariant) : null;
        if (variantLocale && variantLocale !== LOCALE_NOT_FOUND_FIELD_MESSAGE) {
          return variantLocale;
        }
        return name;
      })
      .join(titleSeparator);

    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEGIN) {
      beginOfTitle.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD) {
      beforeKeyword.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
      if (finalKeyword === rubricKeyword) {
        finalKeyword = value;
      } else {
        finalKeyword = finalKeyword + titleSeparator + value;
      }
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD) {
      afterKeyword.push(value);
    }
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_END) {
      endOfTitle.push(value);
    }
  });

  return capitalize(
    [finalPrefix, ...beginOfTitle, ...beforeKeyword, finalKeyword, ...afterKeyword, ...endOfTitle]
      .join(' ')
      .toLocaleLowerCase(),
  );
}

export interface GetCatalogueAttributesInterface {
  filter: string[];
  realFilterOptions: string[];
  attributes: RubricAttributeModel[];
  city: string;
  getFieldLocale: GetFieldLocaleType;
  noFiltersSelected: boolean;
  rubricId: ObjectIdModel;
  pricesStage: any;
}

export interface GetCatalogueAttributesPayloadInterface {
  selectedFilters: SelectedFilterInterface[];
  castedAttributes: CatalogueFilterAttributeModel[];
}

export async function getCatalogueAttributes({
  filter,
  realFilterOptions,
  getFieldLocale,
  attributes,
  city,
  noFiltersSelected,
  rubricId,
  pricesStage,
}: GetCatalogueAttributesInterface): Promise<GetCatalogueAttributesPayloadInterface> {
  const db = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const selectedFilters: SelectedFilterInterface[] = [];
  const castedAttributes: CatalogueFilterAttributeModel[] = [];

  for await (const attribute of attributes) {
    const { options, slug } = attribute;
    const castedOptions: CatalogueFilterAttributeOptionModel[] = [];
    const selectedOptions: RubricOptionModel[] = [];

    // console.log('');
    // console.log(`Attribute ${slug} >>>>>>>>>`);

    for await (const option of options) {
      // check if selected
      const optionSlug = option.slug;
      const isSelected = filter.includes(optionSlug);

      // Push to the selected options list for catalogue title config
      if (isSelected) {
        selectedOptions.push(option);
      }

      const optionNextSlug = isSelected
        ? filter
            .filter((pathArg) => {
              return pathArg !== optionSlug;
            })
            .join('/')
        : [...filter, optionSlug].join('/');

      // If price attribute
      if (slug === PRICE_ATTRIBUTE_SLUG) {
        const splittedOption = optionSlug.split(CATALOGUE_OPTION_SEPARATOR);
        const filterOptionValue = splittedOption[1];
        const prices = filterOptionValue.split('_');
        const minPrice = prices[0] ? noNaN(prices[0]) : null;
        const maxPrice = prices[1] ? noNaN(prices[1]) : null;

        if (!minPrice || !maxPrice) {
          continue;
        }
        const isPricesSelected = Object.keys(pricesStage).length > 0;

        const optionPricesStage = {
          [`minPriceCities.${city}`]: {
            $gte: minPrice,
            $lte: maxPrice,
          },
        };

        const optionFinalPricesStage = {
          $and: isPricesSelected ? [optionPricesStage, pricesStage] : [optionPricesStage],
        };

        const optionProductsMatch = noFiltersSelected
          ? {
              rubricId,
              ...optionFinalPricesStage,
            }
          : {
              rubricId,
              selectedOptionsSlugs: {
                $all: realFilterOptions,
              },
              ...optionFinalPricesStage,
            };

        const optionProduct = await productsCollection.findOne(optionProductsMatch, {
          projection: { _id: 1 },
        });

        if (optionProduct) {
          castedOptions.push({
            _id: option._id,
            name: getFieldLocale(option.nameI18n),
            slug: option.slug,
            nextSlug: `/${optionNextSlug}`,
            isSelected,
          });
        }
        continue;
      }

      castedOptions.push({
        _id: option._id,
        name: getFieldLocale(option.nameI18n),
        slug: option.slug,
        nextSlug: `/${optionNextSlug}`,
        isSelected,
      });
    }

    if (castedOptions.length < 1) {
      continue;
    }

    // attribute
    const otherSelectedValues = filter.filter((param) => {
      const castedParam = castCatalogueParamToObject(param);
      return castedParam.slug !== attribute.slug;
    });
    const clearSlug = `/${otherSelectedValues.join('/')}`;

    const isSelected = castedOptions.some(({ isSelected }) => isSelected);
    if (isSelected) {
      // Add selected items to the catalogue title config
      selectedFilters.push({
        attribute,
        options: selectedOptions,
      });
    }

    const castedAttribute = {
      _id: attribute._id,
      clearSlug,
      slug: attribute.slug,
      name: getFieldLocale(attribute.nameI18n),
      options: castedOptions,
      isSelected,
    };

    castedAttributes.push(castedAttribute);
  }

  return {
    selectedFilters,
    castedAttributes,
  };
}
