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
} from 'db/dbModels';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  CATALOGUE_NAV_VISIBLE_ATTRIBUTES,
  CATALOGUE_NAV_VISIBLE_OPTIONS,
  CATALOGUE_OPTION_SEPARATOR,
  CATALOGUE_PRODUCTS_LIMIT,
  CATALOGUE_SNIPPET_VISIBLE_ATTRIBUTES,
  DEFAULT_CITY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  LOCALE_NOT_FOUND_FIELD_MESSAGE,
  PRICE_ATTRIBUTE_SLUG,
  ROUTE_CATALOGUE,
  SECONDARY_LOCALE,
  SHOP_PRODUCTS_DEFAULT_SORT_BY_KEY,
  SORT_ASC,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from 'config/common';
import { getDatabase } from 'db/mongodb';
import { getCityFieldData, getCurrencyString, getI18nLocaleValue } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { getRubricCatalogueAttributes, getRubricNavAttributes } from 'lib/rubricUtils';
import { GetFieldLocaleType } from 'lib/sessionHelpers';
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

  function castArrayToTitle(arr: any[]): string {
    const filteredArray = arr.filter((word) => word);
    const firstWord = filteredArray[0];
    const otherWords = filteredArray.slice(1);
    return [capitalize(firstWord), ...otherWords].filter((value) => value).join(' ');
  }

  // Return default rubric title if no filters selected
  if (selectedFilters.length < 1) {
    return getFieldLocale(defaultTitleI18n);
  }

  const titleSeparator = getFieldTranslation(`catalogueTitleSeparator.${locale}`);
  const rubricKeywordTranslation = getFieldLocale(keywordI18n);
  const rubricKeyword =
    rubricKeywordTranslation === LOCALE_NOT_FOUND_FIELD_MESSAGE
      ? ''
      : rubricKeywordTranslation.toLowerCase();

  const finalPrefixTranslation = getFieldLocale(prefixI18n);
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
    const { positioningInTitle, metric } = attribute;
    const positionInTitleForCurrentLocale = getFieldLocale(positioningInTitle);
    const metricValue = metric ? ` ${getFieldLocale(metric.nameI18n)}` : '';

    const value = options
      .map(({ variants, nameI18n }) => {
        const name = getFieldLocale(nameI18n);
        const currentVariant = variants[finalGender];
        const variantLocale = currentVariant ? getFieldLocale(currentVariant) : null;
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

export interface GetCatalogueAttributesInterface {
  filter: string[];
  attributes: RubricAttributeModel[];
  getFieldLocale: GetFieldLocaleType;
  productsPrices: CatalogueProductPricesInterface[];
}

export interface GetCatalogueAttributesPayloadInterface {
  selectedFilters: SelectedFilterInterface[];
  castedAttributes: CatalogueFilterAttributeModel[];
}

export async function getCatalogueAttributes({
  filter,
  getFieldLocale,
  attributes,
  productsPrices,
}: GetCatalogueAttributesInterface): Promise<GetCatalogueAttributesPayloadInterface> {
  const selectedFilters: SelectedFilterInterface[] = [];
  const castedAttributes: CatalogueFilterAttributeModel[] = [];

  for await (const attribute of attributes) {
    const { options, slug } = attribute;
    const castedOptions: CatalogueFilterAttributeOptionModel[] = [];
    const selectedOptions: RubricOptionModel[] = [];

    for await (const option of options) {
      // check if selected
      const optionSlug = option.slug;
      const isSelected = filter.includes(optionSlug);

      // Push to the selected options list for catalogue title config
      if (isSelected) {
        selectedOptions.push(option);
      }

      const optionNextSlug = isSelected
        ? [...filter]
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

        const optionProduct = productsPrices.find(({ _id }) => {
          return noNaN(_id) >= minPrice && noNaN(_id) <= maxPrice;
        });

        if (optionProduct) {
          castedOptions.push({
            _id: option._id,
            name: getFieldLocale(option.nameI18n),
            slug: option.slug,
            nextSlug: `${ROUTE_CATALOGUE}/${optionNextSlug}`,
            isSelected,
          });
        }
        continue;
      }

      castedOptions.push({
        _id: option._id,
        name: getFieldLocale(option.nameI18n),
        slug: option.slug,
        nextSlug: `${ROUTE_CATALOGUE}/${optionNextSlug}`,
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
    const clearSlug = `${ROUTE_CATALOGUE}/${otherSelectedValues.join('/')}`;

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
      metric: attribute.metric ? getFieldLocale(attribute.metric.nameI18n) : null,
      viewVariant: attribute.viewVariant,
    };

    castedAttributes.push(castedAttribute);
  }

  return {
    selectedFilters,
    castedAttributes,
  };
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
  function getFieldLocale(i18nField?: Record<string, string> | null): string {
    if (!i18nField) {
      return '';
    }

    let translation = getI18nLocaleValue<string>(i18nField, locale);

    // Get fallback language if chosen not found
    if (!translation) {
      translation = i18nField[SECONDARY_LOCALE];
    }

    // Get default language if fallback not found
    if (!translation) {
      translation = i18nField[DEFAULT_LOCALE];
    }

    // Set warning massage if fallback language not found
    if (!translation) {
      translation = LOCALE_NOT_FOUND_FIELD_MESSAGE;
    }

    return translation;
  }

  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const db = await getDatabase();
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

    // Args
    const { lastProductId, filter } = input;
    const [rubricSlug, ...filterOptions] = filter;

    // Get configs
    // const configsTimeStart = new Date().getTime();
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
    // console.log('Configs >>>>>>>>>>>>>>>> ', new Date().getTime() - configsTimeStart);

    // Get rubric
    // const rubricTimeStart = new Date().getTime();
    const rubricAggregation = await rubricsCollection
      .aggregate([
        {
          $match: { slug: rubricSlug },
        },
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
    // console.log('Rubric >>>>>>>>>>>>>>>> ', new Date().getTime() - rubricTimeStart);

    if (!rubric) {
      return null;
    }

    // Cast selected options
    const realFilterOptions: string[] = [];
    let sortBy: string | null = null;
    let sortDir: string | null = null;

    const sortFilterOptions: string[] = [];
    let minPrice: number | null = null;
    let maxPrice: number | null = null;
    filterOptions.forEach((filterOption) => {
      const splittedOption = filterOption.split(CATALOGUE_OPTION_SEPARATOR);
      const filterOptionName = splittedOption[0];
      const filterOptionValue = splittedOption[1];
      if (filterOptionName) {
        const isPriceRange = filterOptionName === PRICE_ATTRIBUTE_SLUG;

        if (isPriceRange) {
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

    // Product stages
    const noFiltersSelected = realFilterOptions.length < 1;
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
    const castedSortDir = sortDir === SORT_DESC_STR ? SORT_DESC : SORT_ASC;
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
        [`minPriceCities.${city}`]: castedSortDir,
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
                  $project: {
                    _id: 1,
                  },
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
    const attributes = await getRubricCatalogueAttributes({
      config: productsAggregationResult.options,
      attributes: rubric.attributes,
      visibleOptionsCount,
      city,
    });

    const finalAttributes = [getPriceAttribute(), ...attributes];
    const { selectedFilters, castedAttributes } = await getCatalogueAttributes({
      attributes: finalAttributes,
      getFieldLocale,
      filter,
      productsPrices: productsAggregationResult.prices,
    });
    // console.log('Options >>>>>>>>>>>>>>>> ', new Date().getTime() - beforeOptions);

    // Get selected attributes
    const castedFilters = filterOptions.map((param) => castCatalogueParamToObject(param));
    const selectedAttributes = rubric.attributes.reduce(
      (acc: CatalogueFilterAttributeModel[], attribute) => {
        if (
          attribute.variant !== ATTRIBUTE_VARIANT_SELECT &&
          attribute.variant !== ATTRIBUTE_VARIANT_MULTIPLE_SELECT
        ) {
          return acc;
        }
        const currentFilter = castedFilters.find(({ slug }) => attribute.slug === slug);
        if (!currentFilter) {
          return acc;
        }

        const options = attribute.options.reduce(
          (acc: CatalogueFilterAttributeOptionModel[], option) => {
            if (!filterOptions.includes(option.slug)) {
              return acc;
            }

            const nextSlug = filter
              .filter((pathArg) => {
                return pathArg !== option.slug;
              })
              .join('/');
            return [
              ...acc,
              {
                _id: new ObjectId(),
                clearSlug: '',
                slug: option.slug,
                name: getFieldLocale(option.nameI18n),
                counter: 1,
                isSelected: true,
                isDisabled: false,
                nextSlug: `${ROUTE_CATALOGUE}/${nextSlug}`,
              },
            ];
          },
          [],
        );

        return [
          ...acc,
          {
            _id: new ObjectId(),
            clearSlug: '',
            slug: attribute.slug,
            name: getFieldLocale(attribute.nameI18n),
            isSelected: true,
            isDisabled: false,
            options,
            viewVariant: attribute.viewVariant,
          },
        ];
      },
      [],
    );

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
      const minPrice = noNaN(facet?.minPriceCities ? facet?.minPriceCities[city] : undefined);
      const maxPrice = noNaN(facet?.maxPriceCities ? facet?.maxPriceCities[city] : undefined);
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
        getFieldLocale,
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
        getFieldLocale,
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
              name: getFieldLocale(connectionProduct.option.nameI18n),
            },
            product: {
              ...product,
              name: getFieldLocale(product.nameI18n),
            },
          });
        }

        connections.push({
          ...productConnection,
          attributeName: getFieldLocale(productConnection.attributeNameI18n),
          connectionProducts,
        });
      }

      products.push({
        ...restProduct,
        listFeatures,
        ratingFeatures,
        name: getFieldLocale(product.nameI18n),
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
      getFieldLocale,
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
      rubricName: getFieldLocale(rubric.nameI18n),
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
}: GetPageInitialDataInterface): Promise<PageInitialDataPayload> => {
  // console.log(' ');
  // console.log('=================== getPageInitialData =======================');
  // const timeStart = new Date().getTime();
  function getFieldLocale(i18nField?: Record<string, string> | null): string {
    if (!i18nField) {
      return '';
    }

    let translation = getI18nLocaleValue<string>(i18nField, locale);

    // Get fallback language if chosen not found
    if (!translation) {
      translation = i18nField[SECONDARY_LOCALE];
    }

    // Get default language if fallback not found
    if (!translation) {
      translation = i18nField[DEFAULT_LOCALE];
    }

    // Set warning massage if fallback language not found
    if (!translation) {
      translation = LOCALE_NOT_FOUND_FIELD_MESSAGE;
    }

    return translation;
  }

  function getCityLocale(cityField: Record<string, Record<string, any>>): any {
    const cityData = getCityFieldData(cityField, city);
    if (!cityData) {
      throw Error('getCityLocale error');
    }
    const cityLocale = getFieldLocale(cityData);
    if (!cityLocale) {
      throw Error('getCityLocale error');
    }
    return cityLocale;
  }

  const db = await getDatabase();

  // configs
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const initialConfigs = await configsCollection.find({}, { sort: { _id: SORT_ASC } }).toArray();
  const configs = initialConfigs.map((config) => {
    return {
      ...config,
      value: getCityLocale(config.cities),
      singleValue: getCityLocale(config.cities)[0],
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
      name: getFieldLocale(city.nameI18n),
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

  const sortedRubrics = rubrics.sort((rubricA, rubricB) => {
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
