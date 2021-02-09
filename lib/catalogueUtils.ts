import {
  AttributeModel,
  CatalogueFilterAttributeModel,
  CatalogueFilterAttributeOptionModel,
  GenderModel,
  OptionModel,
  RubricCatalogueTitleModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  SORT_BY_ID_DIRECTION,
  SORT_DESC,
} from 'config/common';
import { getCatalogueVisibleOptionsCount } from 'lib/rubricUtils';
import { ObjectId } from 'mongodb';
import { COL_PRODUCTS } from 'db/collectionNames';
import capitalize from 'capitalize';
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

interface GetParamOptionFirstValueByKey {
  slug: string;
  castedParams: CastCatalogueParamToObjectPayloadInterface[];
  defaultValue?: string;
}

export function getParamOptionFirstValueByKey({
  slug,
  castedParams,
  defaultValue,
}: GetParamOptionFirstValueByKey): string | undefined {
  const currentParam = castedParams.find((param) => param.slug === slug);

  if (!currentParam) {
    return defaultValue;
  }

  const firstValue = currentParam.value;

  if (!firstValue) {
    return defaultValue;
  }
  return firstValue;
}

interface GetCatalogueAdditionalFilterOptionsInterface {
  productForeignField: string;
  productsMainPipeline: any[];
  collectionSlugs: string[];
  catalogueFilterArgs: string[];
  collection: string;
  filterKey: string;
  city: string;
}

interface GetCatalogueAdditionalFilterOptionsPayloadInterface
  extends Omit<CatalogueFilterAttributeOptionModel, 'name'> {
  nameI18n: TranslationModel;
}

export async function getCatalogueAdditionalFilterOptions({
  productsMainPipeline,
  catalogueFilterArgs,
  productForeignField,
  collectionSlugs,
  collection,
  filterKey,
  city,
}: GetCatalogueAdditionalFilterOptionsInterface): Promise<
  GetCatalogueAdditionalFilterOptionsPayloadInterface[]
> {
  const maxVisibleOptions = await getCatalogueVisibleOptionsCount(city);
  const currentCatalogueSlug = catalogueFilterArgs.join('/');
  const db = await getDatabase();
  const aggregationResult = await db
    .collection<GetCatalogueAdditionalFilterOptionsPayloadInterface>(collection)
    .aggregate([
      {
        $sort: {
          [`priority.${city}`]: SORT_DESC,
          [`views.${city}`]: SORT_DESC,
          _id: SORT_BY_ID_DIRECTION,
        },
      },

      {
        $limit: maxVisibleOptions,
      },

      // Lookup products
      {
        $lookup: {
          from: COL_PRODUCTS,
          let: { slug: '$slug' },
          pipeline: [
            ...productsMainPipeline,
            {
              $match: {
                $expr: {
                  $and: [{ $eq: [productForeignField, '$$slug'] }],
                },
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: 'products',
        },
      },

      // Count products
      { $addFields: { productsCount: { $size: '$products' } } },

      // Add isDisabled field based on productsCount
      {
        $addFields: {
          isDisabled: {
            $lt: ['$productsCount', 1],
          },
        },
      },

      // Sort pipeline
      {
        $sort: {
          [`views.${city}`]: SORT_DESC,
          [`priority.${city}`]: SORT_DESC,
          productsCount: SORT_DESC,
          isDisabled: SORT_DESC,
          _id: SORT_BY_ID_DIRECTION,
        },
      },

      // Add isSelected field based on query args
      {
        $addFields: {
          isSelected: {
            $in: ['$slug', collectionSlugs],
          },
        },
      },

      // Add nextSlug field based on query args
      {
        $addFields: {
          itemSlug: {
            $concat: [`${filterKey}-`, '$slug'],
          },
        },
      },
      {
        $addFields: {
          resetSlugsList: {
            $filter: {
              input: catalogueFilterArgs,
              as: 'filterArg',
              cond: { $ne: ['$$filterArg', '$itemSlug'] },
            },
          },
        },
      },
      {
        $addFields: {
          nextSlug: {
            $cond: {
              if: '$isSelected',
              then: {
                $reduce: {
                  input: '$resetSlugsList',
                  initialValue: '',
                  in: { $concat: ['$$value', '/', '$$this'] },
                },
              },
              else: {
                $concat: ['/', currentCatalogueSlug, '/', `$itemSlug`],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          slug: 1,
          nameI18n: 1,
          nextSlug: 1,
          isSelected: 1,
          isDisabled: 1,
          counter: '$productsCount',
        },
      },
    ])
    .toArray();

  // TODO Increase option views counter if isSelected

  return aggregationResult;
}

export interface GetCatalogueAttributeInterface {
  _id: ObjectId;
  slug: string;
  name: string;
  options: CatalogueFilterAttributeOptionModel[];
  catalogueFilter: string[];
}

export async function getCatalogueAttribute({
  _id,
  slug,
  name,
  options,
  catalogueFilter,
}: GetCatalogueAttributeInterface): Promise<CatalogueFilterAttributeModel> {
  const otherSelectedValues = catalogueFilter.filter((param) => {
    const castedParam = castCatalogueParamToObject(param);
    return castedParam.slug !== slug;
  });
  const clearSlug = `/${otherSelectedValues.join('/')}`;
  const isSelected = options.some(({ isSelected }) => isSelected);
  const disabledOptionsCount = options.reduce((acc: number, { isDisabled }) => {
    if (isDisabled) {
      return acc + 1;
    }
    return acc;
  }, 0);
  return {
    _id,
    slug,
    name,
    clearSlug,
    options,
    isDisabled: disabledOptionsCount === options.length,
    isSelected,
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
