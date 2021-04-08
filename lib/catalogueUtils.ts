import { getPriceAttribute } from 'config/constantAttributes';
import {
  COL_CITIES,
  COL_CONFIGS,
  COL_COUNTRIES,
  COL_LANGUAGES,
  COL_PRODUCT_FACETS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  AttributeModel,
  CatalogueDataInterface,
  CatalogueFilterAttributeModel,
  CatalogueFilterAttributeOptionModel,
  CityModel,
  ConfigModel,
  CountryModel,
  GenderModel,
  LanguageModel,
  ObjectIdModel,
  OptionModel,
  ProductConnectionItemModel,
  ProductConnectionModel,
  ProductFacetModel,
  ProductModel,
  CatalogueProductPricesInterface,
  RubricAttributeModel,
  RubricCatalogueTitleModel,
  RubricModel,
  RubricOptionModel,
  CatalogueProductsAggregationInterface,
  CatalogueProductOptionInterface,
} from 'db/dbModels';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  CATALOGUE_FILTER_LIMIT,
  CATALOGUE_FILTER_PAGE,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  CATALOGUE_NAV_VISIBLE_ATTRIBUTES,
  CATALOGUE_NAV_VISIBLE_OPTIONS,
  CATALOGUE_OPTION_SEPARATOR,
  CATALOGUE_PRODUCTS_LIMIT,
  CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES,
  CONFIG_DEFAULT_COMPANY_SLUG,
  DEFAULT_CITY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  PAGINATION_DEFAULT_LIMIT,
  PRICE_ATTRIBUTE_SLUG,
  ROUTE_CATALOGUE,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_ASC,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import {
  getCityFieldLocaleString,
  getCurrencyString,
  getFieldStringLocale,
  getI18nLocaleValue,
} from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { getRubricNavAttributes } from 'lib/rubricUtils';
import { getFieldTranslation } from 'config/constantTranslations';
import { ObjectId } from 'mongodb';
import capitalize from 'capitalize';

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
  catalogueTitle: RubricCatalogueTitleModel;
  locale: string;
}

export function getCatalogueTitle({
  selectedFilters,
  catalogueTitle,
  locale,
}: GetCatalogueTitleInterface): string {
  const { gender: rubricGender, defaultTitleI18n, keywordI18n, prefixI18n } = catalogueTitle;

  function castArrayToTitle(arr: any[]): string {
    const filteredArray = arr.filter((word) => word);
    const firstWord = filteredArray[0];
    const otherWords = filteredArray.slice(1);
    return [capitalize(firstWord), ...otherWords].filter((value) => value).join(' ');
  }

  // Return default rubric title if no filters selected
  if (selectedFilters.length < 1) {
    return getFieldStringLocale(defaultTitleI18n, locale);
  }

  const titleSeparator = getFieldTranslation(`catalogueTitleSeparator.${locale}`);
  const rubricKeywordTranslation = getFieldStringLocale(keywordI18n, locale);
  const rubricKeyword =
    rubricKeywordTranslation === LOCALE_NOT_FOUND_FIELD_MESSAGE
      ? ''
      : rubricKeywordTranslation.toLowerCase();

  const finalPrefixTranslation = getFieldStringLocale(prefixI18n, locale);
  const finalPrefix =
    finalPrefixTranslation === LOCALE_NOT_FOUND_FIELD_MESSAGE ? '' : finalPrefixTranslation;

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
    const { positioningInTitle, metric } = attribute;
    const positionInTitleForCurrentLocale = getFieldStringLocale(positioningInTitle, locale);
    const metricValue = metric ? ` ${getFieldStringLocale(metric.nameI18n, locale)}` : '';

    const value = options
      .map(({ variants, nameI18n }) => {
        const name = getFieldStringLocale(nameI18n, locale);
        const currentVariant = variants[finalGender];
        const variantLocale = currentVariant ? getFieldStringLocale(currentVariant, locale) : null;
        let value = name;
        if (variantLocale && variantLocale !== LOCALE_NOT_FOUND_FIELD_MESSAGE) {
          value = variantLocale;
        }
        const optionValue = `${value}${metricValue}`;
        return attribute.capitalise ? capitalize(optionValue) : optionValue.toLocaleLowerCase();
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
        finalKeyword = value.toLowerCase();
      } else {
        finalKeyword = finalKeyword + titleSeparator + value.toLowerCase();
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

export interface GetRubricCatalogueOptionsInterface {
  options: RubricOptionModel[];
  // maxVisibleOptions: number;
  visibleOptionsSlugs: string[];
  city: string;
}

export function getRubricCatalogueOptions({
  options,
  // maxVisibleOptions,
  visibleOptionsSlugs,
  city,
}: GetRubricCatalogueOptionsInterface): RubricOptionModel[] {
  const visibleOptions = options.filter(({ slug }) => {
    return visibleOptionsSlugs.includes(slug);
  });
  // .slice(0, maxVisibleOptions);

  return visibleOptions.map((option) => {
    return {
      ...option,
      options: getRubricCatalogueOptions({
        options: option.options,
        // maxVisibleOptions,
        visibleOptionsSlugs,
        city,
      }),
    };
  });
}

export interface GetRubricCatalogueAttributesInterface {
  city: string;
  attributes: RubricAttributeModel[];
  // visibleOptionsCount: number;
  config: CatalogueProductOptionInterface[];
}

export async function getRubricCatalogueAttributes({
  city,
  attributes,
  // visibleOptionsCount,
  config,
}: GetRubricCatalogueAttributesInterface): Promise<RubricAttributeModel[]> {
  const sortedAttributes: RubricAttributeModel[] = [];
  attributes.forEach((attribute) => {
    const attributeInConfig = config.find(({ _id }) => _id === attribute.slug);
    if (!attributeInConfig) {
      return;
    }

    sortedAttributes.push({
      ...attribute,
      options: getRubricCatalogueOptions({
        options: attribute.options,
        // maxVisibleOptions: visibleOptionsCount,
        visibleOptionsSlugs: attributeInConfig.optionsSlugs,
        city,
      }),
    });
  });

  return [getPriceAttribute(), ...sortedAttributes];
}

export interface GetCatalogueAttributesInterface {
  filter: string[];
  attributes: RubricAttributeModel[];
  locale: string;
  productsPrices: CatalogueProductPricesInterface[];
  basePath: string;
}

export interface GetCatalogueAttributesPayloadInterface {
  selectedFilters: SelectedFilterInterface[];
  castedAttributes: CatalogueFilterAttributeModel[];
  selectedAttributes: CatalogueFilterAttributeModel[];
}

export async function getCatalogueAttributes({
  filter,
  locale,
  attributes,
  productsPrices,
  basePath,
}: GetCatalogueAttributesInterface): Promise<GetCatalogueAttributesPayloadInterface> {
  const selectedFilters: SelectedFilterInterface[] = [];
  const castedAttributes: CatalogueFilterAttributeModel[] = [];
  const selectedAttributes: CatalogueFilterAttributeModel[] = [];

  const realFilter = filter.filter((filterItem) => {
    const filterItemArr = filterItem.split(CATALOGUE_OPTION_SEPARATOR);
    const filterName = filterItemArr[0];
    return filterName !== CATALOGUE_FILTER_PAGE;
  });

  for await (const attribute of attributes) {
    const { options, slug } = attribute;
    const castedOptions: CatalogueFilterAttributeOptionModel[] = [];
    const selectedFilterOptions: CatalogueFilterAttributeOptionModel[] = [];
    const selectedOptions: RubricOptionModel[] = [];

    for await (const option of options) {
      // check if selected
      const optionSlug = option.slug;
      const isSelected = realFilter.includes(optionSlug);

      // Push to the selected options list for catalogue title config
      if (isSelected) {
        selectedOptions.push(option);
      }

      const optionNextSlug = isSelected
        ? [...realFilter]
            .filter((pathArg) => {
              return pathArg !== optionSlug;
            })
            .join('/')
        : [...realFilter, optionSlug].join('/');

      const castedOption = {
        _id: option._id,
        name: getFieldStringLocale(option.nameI18n, locale),
        slug: option.slug,
        nextSlug: `${basePath}/${optionNextSlug}`,
        isSelected,
      };

      // Push to the selected options list for catalogue title config
      if (isSelected) {
        selectedOptions.push(option);
        selectedFilterOptions.push(castedOption);
      }

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

        const optionProduct = productsPrices.find(({ _id }) => {
          return noNaN(_id) >= minPrice && noNaN(_id) <= maxPrice;
        });

        if (optionProduct) {
          castedOptions.push(castedOption);
        }
        continue;
      }

      castedOptions.push(castedOption);
    }

    if (castedOptions.length < 1) {
      continue;
    }

    // attribute
    const otherSelectedValues = realFilter.filter((param) => {
      const castedParam = castCatalogueParamToObject(param);
      return castedParam.slug !== attribute.slug;
    });
    const clearSlug = `${basePath}/${otherSelectedValues.join('/')}`;

    const isSelected = castedOptions.some(({ isSelected }) => isSelected);

    const castedAttribute = {
      _id: attribute._id,
      clearSlug,
      slug: attribute.slug,
      name: getFieldStringLocale(attribute.nameI18n, locale),
      options: castedOptions,
      isSelected,
      metric: attribute.metric ? getFieldStringLocale(attribute.metric.nameI18n, locale) : null,
      viewVariant: attribute.viewVariant,
    };

    if (isSelected) {
      selectedAttributes.push({
        ...castedAttribute,
        options: selectedFilterOptions,
      });

      // Add selected items to the catalogue title config
      selectedFilters.push({
        attribute,
        options: selectedOptions,
      });
    }

    castedAttributes.push(castedAttribute);
  }

  return {
    selectedFilters,
    castedAttributes,
    selectedAttributes,
  };
}

interface GetCatalogueConfigsPayloadInterface {
  visibleOptionsCount: number;
  snippetVisibleAttributesCount: number;
}

export async function getCatalogueConfigs(): Promise<GetCatalogueConfigsPayloadInterface> {
  const db = await getDatabase();
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const catalogueFilterVisibleOptionsCount = await configsCollection.findOne({
    slug: 'catalogueFilterVisibleOptionsCount',
  });
  const visibleOptionsCount =
    noNaN(catalogueFilterVisibleOptionsCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_FILTER_VISIBLE_OPTIONS);

  const snippetVisibleAttributesCountConfig = await configsCollection.findOne({
    slug: 'snippetAttributesCount',
  });
  const snippetVisibleAttributesCount =
    noNaN(snippetVisibleAttributesCountConfig?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES);

  return {
    visibleOptionsCount,
    snippetVisibleAttributesCount,
  };
}

interface CastCatalogueFiltersPayloadInterface {
  minPrice?: number | null;
  maxPrice?: number | null;
  realFilterOptions: string[];
  sortBy: string | null;
  sortDir: 1 | -1;
  sortFilterOptions: string[];
  noFiltersSelected: boolean;
  page: number;
  skip: number;
  limit: number;
  pagerUrl: string;
}

export function castCatalogueFilters(filters: string[]): CastCatalogueFiltersPayloadInterface {
  const realFilterOptions: string[] = [];
  let sortBy: string | null = null;
  let sortDir: string | null = null;

  // pagination
  const pagerUrlParts: string[] = [];
  const defaultPage = 1;
  let page = defaultPage;

  const defaultLimit = PAGINATION_DEFAULT_LIMIT;
  let limit = defaultLimit;

  // sort
  const sortFilterOptions: string[] = [];

  // prices
  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  filters.forEach((filterOption) => {
    const splittedOption = filterOption.split(CATALOGUE_OPTION_SEPARATOR);
    const filterOptionName = splittedOption[0];
    const filterOptionValue = splittedOption[1];
    if (filterOptionName) {
      if (filterOptionName === CATALOGUE_FILTER_PAGE) {
        page = noNaN(filterOptionValue) || defaultPage;
        return;
      } else {
        pagerUrlParts.push(filterOption);
      }

      if (filterOptionName === CATALOGUE_FILTER_LIMIT) {
        limit = noNaN(filterOptionValue) || defaultLimit;
        return;
      }

      if (filterOptionName === PRICE_ATTRIBUTE_SLUG) {
        const prices = filterOptionValue.split('_');
        minPrice = prices[0] ? noNaN(prices[0]) : null;
        maxPrice = prices[1] ? noNaN(prices[1]) : null;
        return;
      }

      if (filterOptionName === SORT_BY_KEY) {
        sortFilterOptions.push(filterOption);
        sortBy = filterOptionValue;
        return;
      }

      if (filterOptionName === SORT_DIR_KEY) {
        sortFilterOptions.push(filterOption);
        sortDir = filterOptionValue;
        return;
      }

      realFilterOptions.push(filterOption);
    }
  });

  const noFiltersSelected = realFilterOptions.length < 1;
  const castedSortDir = sortDir === SORT_DESC_STR ? SORT_DESC : SORT_ASC;
  const skip = page ? (page - 1) * limit : 0;

  return {
    minPrice,
    maxPrice,
    realFilterOptions,
    sortBy,
    sortDir: castedSortDir,
    sortFilterOptions,
    noFiltersSelected,
    page,
    limit,
    skip,
    pagerUrl: `/${pagerUrlParts.join('/')}`,
  };
}

export async function getCatalogueRubric(
  pipeline: Record<string, any>[],
): Promise<RubricModel | null | undefined> {
  const db = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const rubricAggregation = await rubricsCollection
    .aggregate([
      ...pipeline,
      {
        $project: {
          _id: 1,
          slug: 1,
          nameI18n: 1,
          catalogueTitle: 1,
          attributes: {
            $filter: {
              input: '$attributes',
              as: 'attribute',
              cond: {
                $eq: ['$$attribute.showInCatalogueFilter', true],
              },
            },
          },
        },
      },
    ])
    .toArray();
  const rubric = rubricAggregation[0];
  return rubric;
}

export interface GetCatalogueDataInterface {
  locale: string;
  city: string;
  input: {
    filter: string[];
    lastProductId?: ObjectIdModel | null | undefined;
  };
}

export const getCatalogueData = async ({
  locale,
  city,
  input,
}: GetCatalogueDataInterface): Promise<CatalogueDataInterface | null> => {
  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const db = await getDatabase();
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);

    // Args
    const { lastProductId, filter } = input;
    const [rubricSlug, ...filterOptions] = filter;

    // Get configs
    // const configsTimeStart = new Date().getTime();
    const { snippetVisibleAttributesCount } = await getCatalogueConfigs();
    // console.log('Configs >>>>>>>>>>>>>>>> ', new Date().getTime() - configsTimeStart);

    // Get rubric
    // const rubricTimeStart = new Date().getTime();
    const rubric = await getCatalogueRubric([
      {
        $match: { slug: rubricSlug },
      },
    ]);
    // console.log('Rubric >>>>>>>>>>>>>>>> ', new Date().getTime() - rubricTimeStart);

    if (!rubric) {
      return null;
    }

    // Cast selected options
    const {
      minPrice,
      maxPrice,
      realFilterOptions,
      sortBy,
      sortDir,
      sortFilterOptions,
      noFiltersSelected,
    } = castCatalogueFilters(filterOptions);

    // Product stages
    const keyStage = lastProductId
      ? {
          _id: {
            $lt: new ObjectId(lastProductId),
          },
        }
      : {};

    const pricesStage =
      minPrice && maxPrice
        ? {
            [`minPriceCities.${city}`]: {
              $gte: minPrice,
              $lte: maxPrice,
            },
          }
        : {};

    const optionsStage = noFiltersSelected
      ? {}
      : {
          selectedOptionsSlugs: {
            $all: realFilterOptions,
          },
        };

    const productsInitialMatch = {
      rubricId: rubric._id,
      active: true,
      ...optionsStage,
      ...pricesStage,
    };

    // sort stage
    let sortStage: any = {
      [`availabilityCities.${city}`]: SORT_DESC,
      [`priorities.${city}`]: SORT_DESC,
      [`views.${city}`]: SORT_DESC,
      _id: SORT_DESC,
    };

    // sort by price
    if (sortBy === SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY) {
      sortStage = {
        [`availabilityCities.${city}`]: SORT_DESC,
        [`minPriceCities.${city}`]: sortDir,
        _id: SORT_DESC,
      };
    }

    // const productsStart = new Date().getTime();
    const productsAggregation = await productFacetsCollection
      .aggregate<CatalogueProductsAggregationInterface>(
        [
          {
            $match: { ...productsInitialMatch },
          },
          {
            $facet: {
              docs: [
                {
                  $sort: {
                    ...sortStage,
                  },
                },
                {
                  $match: keyStage,
                },
                {
                  $limit: CATALOGUE_PRODUCTS_LIMIT,
                },
                {
                  $lookup: {
                    from: COL_PRODUCTS,
                    as: 'products',
                    localField: '_id',
                    foreignField: '_id',
                  },
                },
              ],
              options: [
                {
                  $project: {
                    selectedOptionsSlugs: 1,
                  },
                },
                {
                  $unwind: '$selectedOptionsSlugs',
                },
                {
                  $group: {
                    _id: '$selectedOptionsSlugs',
                  },
                },
                {
                  $addFields: {
                    slugArray: {
                      $split: ['$_id', CATALOGUE_OPTION_SEPARATOR],
                    },
                  },
                },
                {
                  $addFields: {
                    attributeSlug: {
                      $arrayElemAt: ['$slugArray', 0],
                    },
                  },
                },
                {
                  $group: {
                    _id: '$attributeSlug',
                    optionsSlugs: {
                      $addToSet: '$_id',
                    },
                  },
                },
              ],
              prices: [
                {
                  $project: {
                    minPriceCities: 1,
                  },
                },
                {
                  $addFields: {
                    minPrice: `$minPriceCities.${city}`,
                  },
                },
                {
                  $group: {
                    _id: '$minPrice',
                  },
                },
              ],
              countAllDocs: [
                {
                  $count: 'totalDocs',
                },
              ],
            },
          },
          {
            $addFields: {
              totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
            },
          },
          {
            $addFields: {
              totalProducts: '$totalDocsObject.totalDocs',
            },
          },
          {
            $project: {
              docs: 1,
              totalProducts: 1,
              options: 1,
              prices: 1,
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
    const productsAggregationResult = productsAggregation[0];
    // console.log(`Products >>>>>>>>>>>>>>>> `, new Date().getTime() - productsStart);

    if (!productsAggregationResult) {
      return null;
    }

    // Get filter attributes
    // const beforeOptions = new Date().getTime();
    const rubricAttributes = await getRubricCatalogueAttributes({
      config: productsAggregationResult.options,
      attributes: rubric.attributes,
      city,
    });

    const { selectedFilters, castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: rubricAttributes,
      locale,
      filter,
      productsPrices: productsAggregationResult.prices,
      basePath: ROUTE_CATALOGUE,
    });
    // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

    // Get catalogue products
    const products = [];
    const rubricListViewAttributes = castedAttributes.filter(({ viewVariant }) => {
      return viewVariant === ATTRIBUTE_VIEW_VARIANT_LIST;
    });
    for await (const facet of productsAggregationResult.docs) {
      const product = facet.products ? facet.products[0] : null;
      if (!product) {
        continue;
      }

      // prices
      const { attributes, ...restProduct } = product;
      const minPrice = noNaN(facet.minPriceCities ? facet.minPriceCities[city] : undefined);
      const maxPrice = noNaN(facet.maxPriceCities ? facet.maxPriceCities[city] : undefined);

      const cardPrices = {
        _id: new ObjectId(),
        min: getCurrencyString({ value: minPrice, locale }),
        max: getCurrencyString({ value: maxPrice, locale }),
      };

      // image
      const sortedAssets = product.assets.sort((assetA, assetB) => {
        return assetA.index - assetB.index;
      });
      const firstAsset = sortedAssets[0];
      let mainImage = `${process.env.OBJECT_STORAGE_IMAGE_FALLBACK}`;

      if (firstAsset) {
        mainImage = firstAsset.url;
      }

      // listFeatures
      const initialListFeatures = getProductCurrentViewCastedAttributes({
        attributes,
        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
        locale,
      });
      const initialListFeaturesWithIndex = initialListFeatures.map((listAttribute) => {
        const indexInRubric = rubricListViewAttributes.findIndex(
          ({ slug }) => slug === listAttribute.attributeSlug,
        );
        const finalIndexInRubric = indexInRubric < 0 ? 0 : indexInRubric;
        const index = rubricListViewAttributes.length - finalIndexInRubric;
        return {
          ...listAttribute,
          index,
        };
      });
      const sortedListAttributes = initialListFeaturesWithIndex.sort(
        (listAttributeA, listAttributeB) => {
          return noNaN(listAttributeB.index) - noNaN(listAttributeA.index);
        },
      );
      const listFeatures = sortedListAttributes.slice(0, snippetVisibleAttributesCount);

      // ratingFeatures
      const ratingFeatures = getProductCurrentViewCastedAttributes({
        attributes,
        viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
        locale,
      });

      // connections
      const connections: ProductConnectionModel[] = [];
      for await (const productConnection of product.connections) {
        const connectionProducts: ProductConnectionItemModel[] = [];
        for await (const connectionProduct of productConnection.connectionProducts) {
          const product = await productsCollection.findOne(
            { _id: connectionProduct.productId },
            {
              projection: {
                _id: 1,
                slug: 1,
                nameI18n: 1,
              },
            },
          );
          if (!product) {
            continue;
          }
          connectionProducts.push({
            ...connectionProduct,
            option: {
              ...connectionProduct.option,
              name: getFieldStringLocale(connectionProduct.option.nameI18n, locale),
            },
            product: {
              ...product,
              name: getFieldStringLocale(product.nameI18n, locale),
            },
          });
        }

        connections.push({
          ...productConnection,
          attributeName: getFieldStringLocale(productConnection.attributeNameI18n, locale),
          connectionProducts,
        });
      }

      products.push({
        ...restProduct,
        listFeatures,
        ratingFeatures,
        name: getFieldStringLocale(product.nameI18n, locale),
        cardPrices,
        mainImage,
        shopsCount: noNaN(product.shopProductsCountCities[city]),
        connections,
        isCustomersChoice: product.isCustomersChoiceCities[city],
      });
    }

    // Get catalogue title
    const catalogueTitle = getCatalogueTitle({
      catalogueTitle: rubric.catalogueTitle,
      selectedFilters,
      locale,
    });

    // Get keySet pagination
    const lastProduct = products[products.length - 1];
    const hasMore = Boolean(
      lastProduct && lastProductId && !new ObjectId(lastProductId).equals(lastProduct?._id),
    );

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

    // console.log('Total time: ', new Date().getTime() - timeStart);

    return {
      _id: rubric._id,
      lastProductId: lastProduct?._id,
      hasMore,
      clearSlug: `${ROUTE_CATALOGUE}/${rubricSlug}${sortPathname}`,
      filter,
      rubricName: getFieldStringLocale(rubric.nameI18n, locale),
      rubricSlug: rubric.slug,
      products,
      catalogueTitle,
      totalProducts: noNaN(productsAggregationResult.totalProducts),
      attributes: castedAttributes,
      selectedAttributes,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export interface GetPageInitialDataInterface {
  locale: string;
  city: string;
  companySlug?: string;
}

export interface PageInitialDataPayload {
  configs: ConfigModel[];
  cities: CityModel[];
  languages: LanguageModel[];
  currency: string;
}

export const getPageInitialData = async ({
  locale,
  city,
  companySlug,
}: GetPageInitialDataInterface): Promise<PageInitialDataPayload> => {
  // console.log(' ');
  // console.log('=================== getPageInitialData =======================');
  // const timeStart = new Date().getTime();
  const db = await getDatabase();

  // configs
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const initialConfigs = await configsCollection
    .find(
      {
        companySlug: companySlug || CONFIG_DEFAULT_COMPANY_SLUG,
      },
      {
        sort: { _id: SORT_ASC },
      },
    )
    .toArray();
  const configs = initialConfigs.map((config) => {
    return {
      ...config,
      value: getCityFieldLocaleString({ cityField: config.cities, city, locale }),
      singleValue: getCityFieldLocaleString({ cityField: config.cities, city, locale })[0],
    };
  });
  // console.log('After configs ', new Date().getTime() - timeStart);

  // languages
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const languages = await languagesCollection
    .find(
      {},
      {
        sort: {
          _id: SORT_ASC,
        },
      },
    )
    .toArray();
  // console.log('After languages ', new Date().getTime() - timeStart);

  // cities
  const citiesCollection = db.collection<CityModel>(COL_CITIES);
  const initialCities = await citiesCollection.find({}, { sort: { _id: SORT_DESC } }).toArray();
  const cities = initialCities.map((city) => {
    return {
      ...city,
      name: getFieldStringLocale(city.nameI18n, locale),
    };
  });
  // console.log('After cities ', new Date().getTime() - timeStart);

  // currency
  const countriesCollection = db.collection<CountryModel>(COL_COUNTRIES);
  let currency = DEFAULT_CURRENCY;
  const sessionCity = initialCities.find(({ slug }) => slug === city);
  const country = await countriesCollection.findOne({ citiesIds: sessionCity?._id });
  if (country) {
    currency = country.currency;
  }
  // console.log('After currency ', new Date().getTime() - timeStart);

  return {
    configs,
    languages,
    cities,
    currency,
  };
};

export interface GetCatalogueNavRubricsInterface {
  locale: string;
  city: string;
}

export const getCatalogueNavRubrics = async ({
  city,
  locale,
}: GetCatalogueNavRubricsInterface): Promise<RubricModel[]> => {
  // console.log(' ');
  // console.log('=================== getCatalogueNavRubrics =======================');
  // const timeStart = new Date().getTime();

  const db = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

  // Get configs
  const catalogueFilterVisibleAttributesCount = await configsCollection.findOne({
    slug: 'stickyNavVisibleAttributesCount',
  });
  const catalogueFilterVisibleOptionsCount = await configsCollection.findOne({
    slug: 'stickyNavVisibleOptionsCount',
  });
  const visibleAttributesCount =
    noNaN(catalogueFilterVisibleAttributesCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_NAV_VISIBLE_ATTRIBUTES);
  const visibleOptionsCount =
    noNaN(catalogueFilterVisibleOptionsCount?.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]) ||
    noNaN(CATALOGUE_NAV_VISIBLE_OPTIONS);

  // console.log('Before rubrics', new Date().getTime() - timeStart);

  const constantProject = {
    _id: 1,
    slug: 1,
    nameI18n: 1,
    priorities: 1,
    views: 1,
  };

  const initialRubrics = await rubricsCollection
    .aggregate([
      {
        $match: {
          activeProductsCount: { $gt: 0 },
        },
      },
      {
        $project: {
          ...constantProject,
          attributes: {
            $filter: {
              input: '$attributes',
              as: 'attribute',
              cond: {
                $eq: ['$$attribute.showInCatalogueNav', true],
              },
            },
          },
        },
      },
      {
        $addFields: {
          attributes: {
            $slice: ['$attributes', visibleAttributesCount],
          },
        },
      },
      {
        $unwind: {
          path: '$attributes',
        },
      },
      {
        $addFields: {
          'attributes.options.options': [],
        },
      },
      {
        $addFields: {
          'attributes.options': {
            $filter: {
              input: '$attributes.options',
              as: 'option',
              cond: {
                $eq: ['$$option.isSelected', true],
              },
            },
          },
        },
      },
      {
        $addFields: {
          'attributes.options': {
            $slice: ['$attributes.options', visibleOptionsCount],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          slug: { $first: '$slug' },
          nameI18n: { $first: '$nameI18n' },
          priorities: { $first: '$priorities' },
          views: { $first: '$views' },
          attributes: {
            $push: '$attributes',
          },
        },
      },
    ])
    .toArray();
  // console.log('After rubrics', new Date().getTime() - timeStart);

  const rubrics: RubricModel[] = [];
  initialRubrics.forEach((rubric) => {
    rubrics.push({
      ...rubric,
      name: getI18nLocaleValue<string>(rubric.nameI18n, locale),
      navItems: getRubricNavAttributes({
        attributes: rubric.attributes,
        locale,
      }),
    });
  });

  const sortedRubrics = [...rubrics].sort((rubricA, rubricB) => {
    const rubricAViews = rubricA.views || { [city]: 0 };
    const rubricAPriorities = rubricA.priorities || { [city]: 0 };
    const rubricBViews = rubricB.views || { [city]: 0 };
    const rubricBPriorities = rubricB.priorities || { [city]: 0 };

    const rubricACounter = noNaN(rubricAViews[city]) + noNaN(rubricAPriorities[city]);
    const rubricBCounter = noNaN(rubricBViews[city]) + noNaN(rubricBPriorities[city]);
    return rubricBCounter - rubricACounter;
  });

  // console.log('Nav >>>>>>>>>>>>>>>> ', new Date().getTime() - timeStart);

  return sortedRubrics;
};
