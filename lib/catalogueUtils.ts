import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CatalogueInterface } from '../components/Catalogue';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  CATALOGUE_FILTER_LIMIT,
  CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_PAGE_FILTER,
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
  FILTER_CATEGORY_KEY,
  FILTER_PAGE_KEY,
  FILTER_PRICE_KEY,
  FILTER_SEPARATOR,
  GENDER_HE,
  ROUTE_CATALOGUE,
  SORT_BY_KEY,
  SORT_DIR_KEY,
  ZERO_PAGE_FILTER,
} from '../config/common';
import {
  getBrandFilterAttribute,
  getCategoryFilterAttribute,
  getPriceAttribute,
  getRubricFilterAttribute,
} from '../config/constantAttributes';
import {
  DEFAULT_LAYOUT,
  GRID_SNIPPET_LAYOUT_BIG_IMAGE,
  ROW_SNIPPET_LAYOUT_BIG_IMAGE,
} from '../config/constantSelects';
import { COL_RUBRIC_VARIANTS, COL_RUBRICS, COL_SHOP_PRODUCTS } from '../db/collectionNames';
import {
  ignoreNoImageStage,
  paginatedAggregationFinalPipeline,
  productsPaginatedAggregationFacetsPipeline,
  ProductsPaginatedAggregationInterface,
  shopProductDocsFacetPipeline,
  shopProductsGroupPipeline,
} from '../db/dao/constantPipelines';
import { castSummaryForUI } from '../db/dao/product/castSummaryForUI';
import { CatalogueBreadcrumbModel, ObjectIdModel, ShopProductModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import {
  AttributeInterface,
  BrandInterface,
  CatalogueDataInterface,
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
  CatalogueProductPricesInterface,
  CatalogueProductsAggregationInterface,
  CategoryInterface,
  OptionInterface,
  RubricInterface,
  SeoContentInterface,
  ShopProductInterface,
} from '../db/uiInterfaces';
import {
  SeoSchemaBreadcrumbItemInterface,
  SeoSchemaCatalogueInterface,
} from '../types/seoSchemaTypes';
import { alwaysArray, sortObjectsByField } from './arrayUtils';
import { castUrlFilters } from './castUrlFilters';
import { getFieldStringLocale } from './i18n';
import { noNaN } from './numbers';
import { getProductCurrentViewCastedAttributes } from './productAttributesUtils';
import { getCatalogueAllSeoContents } from './seoContentUtils';
import { castDbData, getSiteInitialData } from './ssrUtils';
import { sortStringArray } from './stringUtils';
import { generateTitle } from './titleUtils';
import { getTreeFromList } from './treeUtils';

interface GetSelectedCategoryLeaf {
  acc: ObjectIdModel[];
  selectedCategoriesTree: CategoryInterface[];
}
function getSelectedCategoryLeaf({
  acc,
  selectedCategoriesTree,
}: GetSelectedCategoryLeaf): ObjectIdModel[] {
  return selectedCategoriesTree.reduce((innerAcc: ObjectIdModel[], category) => {
    if (category.categories && category.categories.length > 0) {
      const nestedIds = getSelectedCategoryLeaf({
        acc: [],
        selectedCategoriesTree: category.categories,
      });
      return [...innerAcc, ...nestedIds];
    }
    return [...innerAcc, category._id];
  }, acc);
}

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

export interface GetRubricCatalogueOptionsInterface {
  options: OptionInterface[];
  // maxVisibleOptions: number;
  visibleOptionsSlugs: string[];
  city: string;
}

export function getRubricCatalogueOptions({
  options,
  // maxVisibleOptions,
  visibleOptionsSlugs,
  city,
}: GetRubricCatalogueOptionsInterface): OptionInterface[] {
  const visibleOptions = options.filter(({ slug }) => {
    return visibleOptionsSlugs.includes(slug);
  });
  // .slice(0, maxVisibleOptions);

  return visibleOptions.map((option) => {
    return {
      ...option,
      options: getRubricCatalogueOptions({
        options: option.options || [],
        // maxVisibleOptions,
        visibleOptionsSlugs,
        city,
      }),
    };
  });
}

export interface GetCatalogueAttributesInterface {
  filters: string[];
  attributes: AttributeInterface[];
  locale: string;
  productsPrices: CatalogueProductPricesInterface[];
  basePath: string;
  visibleAttributesCount?: number | null;
  rubricGender?: string;
  brands?: BrandInterface[] | null;
}

export interface GetCatalogueAttributesPayloadInterface {
  selectedFilters: AttributeInterface[];
  castedAttributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  selectedFilterSlugs: string[];
}

interface CastOptionInterface {
  option: OptionInterface;
  attribute: AttributeInterface;
}

interface CastOptionPayloadInterface {
  isSelected: boolean;
  optionSlug: string;
  castedOption: CatalogueFilterAttributeOptionInterface;
}

interface FilterSelectedOptionsInterface {
  option: OptionInterface;
  attributeSlug: string;
  isBrand?: boolean;
  currentBrand?: BrandInterface | null;
}

export async function getCatalogueAttributes({
  filters,
  locale,
  attributes,
  productsPrices,
  basePath,
  visibleAttributesCount,
  rubricGender,
  brands,
}: GetCatalogueAttributesInterface): Promise<GetCatalogueAttributesPayloadInterface> {
  const selectedFilterSlugs: string[] = [];
  const selectedFilters: AttributeInterface[] = [];
  const castedAttributes: CatalogueFilterAttributeInterface[] = [];
  const selectedAttributes: CatalogueFilterAttributeInterface[] = [];

  const realFilter = filters.filter((filterItem) => {
    const filterItemArr = filterItem.split(FILTER_SEPARATOR);
    const filterName = filterItemArr[0];
    return filterName !== FILTER_PAGE_KEY;
    // return filterName !== QUERY_FILTER_PAGE && filterName !== RUBRIC_KEY;
  });

  function filterOptionsList(options: (OptionInterface | null)[]): OptionInterface[] {
    const filteredNestedOptions = options.reduce((acc: OptionInterface[], option) => {
      if (option) {
        return [...acc, option];
      }
      return acc;
    }, []);
    return filteredNestedOptions;
  }

  function getSelectedNestedOptionSlugs(
    option: CatalogueFilterAttributeOptionInterface,
    acc: string[],
  ): string[] {
    const newAcc = [...acc];
    if (option.isSelected && !newAcc.includes(option.castedSlug)) {
      newAcc.push(option.castedSlug);
    }
    if (!option.options || option.options.length < 1) {
      return newAcc;
    }
    return option.options.reduce((innerAcc: string[], option) => {
      return [...innerAcc, ...getSelectedNestedOptionSlugs(option, [])];
    }, newAcc);
  }

  function getOptionNextSlug(
    option: CatalogueFilterAttributeOptionInterface,
  ): CatalogueFilterAttributeOptionInterface {
    const { isSelected, castedSlug } = option;
    if (isSelected) {
      const selectedNestedOptionSlugs = getSelectedNestedOptionSlugs(option, []);
      const newPathFilters = sortStringArray(
        realFilter.filter((path) => {
          return !selectedNestedOptionSlugs.includes(path);
        }),
      );
      return {
        ...option,
        nextSlug: `${basePath}/${newPathFilters.join('/')}`,
        options: (option.options || []).map(getOptionNextSlug),
      };
    }
    const newPathFilters = sortStringArray([...realFilter, castedSlug]);
    return {
      ...option,
      nextSlug: `${basePath}/${newPathFilters.join('/')}`,
    };
  }

  function checkIfOptionSelected(option: OptionInterface, attributeSlug: string): boolean {
    const isBrand = attributeSlug === FILTER_BRAND_KEY;
    const castedSlug = `${attributeSlug}${FILTER_SEPARATOR}${option.slug}`;
    let isSelected = realFilter.includes(castedSlug);
    if (option.options && option.options.length > 0) {
      const childBooleans = option.options.map((childOption) => {
        return checkIfOptionSelected(
          childOption,
          isBrand ? FILTER_BRAND_COLLECTION_KEY : attributeSlug,
        );
      });
      const isChildSelected = childBooleans.some((bool) => bool);
      if (isChildSelected) {
        isSelected = true;
      }
    }

    return isSelected;
  }

  function filterSelectedOptions({
    option,
    attributeSlug,
    currentBrand,
  }: FilterSelectedOptionsInterface): OptionInterface | null {
    const optionSlug = `${attributeSlug}${FILTER_SEPARATOR}${option.slug}`;
    const isBrand = attributeSlug === FILTER_BRAND_KEY;
    const brand = isBrand
      ? (brands || []).find(({ itemId }) => {
          return itemId === option.slug;
        })
      : null;

    if (isBrand && !brand?.showInCatalogueTitle) {
      return null;
    }

    if (currentBrand) {
      const collection = (currentBrand.collections || []).find(({ itemId }) => {
        return itemId === option.slug;
      });
      if (!collection?.showInCatalogueTitle) {
        return null;
      }
    }

    let isSelected = realFilter.includes(optionSlug);
    const nestedOptions = (option.options || []).map((nestedOption) => {
      const child = filterSelectedOptions({
        isBrand,
        currentBrand: brand,
        option: nestedOption,
        attributeSlug: isBrand ? FILTER_BRAND_COLLECTION_KEY : attributeSlug,
      });
      if (child?.isSelected) {
        isSelected = true;
      }
      return child;
    });

    const filteredNestedOptions = filterOptionsList(nestedOptions);

    if (isSelected) {
      return {
        ...option,
        isSelected,
        options: filteredNestedOptions,
      };
    }

    return null;
  }

  function sortOptions(options: CatalogueFilterAttributeOptionInterface[]) {
    return [...options].sort((a, b) => {
      return a.isSelected === b.isSelected ? 0 : a.isSelected ? -1 : 1;
    });
  }

  function castOption({ option, attribute }: CastOptionInterface): CastOptionPayloadInterface {
    // check if selected
    const metricName = getFieldStringLocale(attribute.metric?.nameI18n, locale);
    const castedSlug = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
    let isSelected = checkIfOptionSelected(option, attribute.slug);
    let optionName = getFieldStringLocale(option.nameI18n, locale);
    if (rubricGender) {
      const optionVariantGender = option.variants[rubricGender];
      if (optionVariantGender) {
        optionName = optionVariantGender[locale];
      }
      if (!optionName) {
        optionName = getFieldStringLocale(option.nameI18n, locale);
      }
    }

    const isCategory = attribute.slug === FILTER_CATEGORY_KEY;
    const isBrand = attribute.slug === FILTER_BRAND_KEY;
    const nestedOptions: CatalogueFilterAttributeOptionInterface[] = [];

    if (isCategory || isBrand) {
      for (const nestedOption of option.options || []) {
        const { castedOption } = castOption({
          option: nestedOption,
          attribute: {
            ...attribute,
            slug: isBrand ? FILTER_BRAND_COLLECTION_KEY : attribute.slug,
          },
        });
        nestedOptions.push(castedOption);
      }
    } else {
      for (const nestedOption of option.options || []) {
        const { castedOption } = castOption({
          option: nestedOption,
          attribute,
        });
        if (castedOption.isSelected) {
          isSelected = true;
        }
        nestedOptions.push(castedOption);
      }
    }

    let optionNextSlug = [...realFilter, castedSlug].join('/');
    if (isSelected) {
      optionNextSlug = [...realFilter]
        .filter((pathArg) => {
          return pathArg !== castedSlug;
        })
        .join('/');
      selectedFilterSlugs.push(`${attribute.slug}${FILTER_SEPARATOR}${option.slug}`);
    }

    const castedOption: CatalogueFilterAttributeOptionInterface = {
      _id: option._id,
      name: `${optionName}${metricName ? ` ${metricName}` : ''}`,
      slug: option.slug,
      castedSlug,
      nextSlug: `${basePath}/${optionNextSlug}`,
      isSelected,
      options: sortOptions(nestedOptions),
    };

    return {
      castedOption,
      isSelected,
      optionSlug: castedSlug,
    };
  }

  for await (const attribute of attributes) {
    const { options, slug } = attribute;
    const castedOptions: CatalogueFilterAttributeOptionInterface[] = [];
    const selectedFilterOptions: CatalogueFilterAttributeOptionInterface[] = [];
    const selectedOptions: OptionInterface[] = [];

    for await (const option of options || []) {
      const { castedOption, optionSlug, isSelected } = castOption({ option, attribute });
      const finalOption = getOptionNextSlug(castedOption);

      // Push to the selected options list for catalogue title config and selected attributes view
      if (isSelected) {
        selectedOptions.push(option);
        selectedFilterOptions.push(finalOption);
      }

      // If price attribute
      if (slug === FILTER_PRICE_KEY) {
        const splittedOption = optionSlug.split(FILTER_SEPARATOR);
        const prices = `${splittedOption[1]}`.split('_');
        const minPrice = prices[0];
        const maxPrice = prices[1];

        const priceItem = productsPrices.find(({ _id }) => {
          return noNaN(_id) >= noNaN(minPrice) && noNaN(_id) <= noNaN(maxPrice);
        });

        if (priceItem) {
          castedOptions.push(finalOption);
        }
      } else {
        castedOptions.push(finalOption);
      }
    }

    if (castedOptions.length < 1) {
      continue;
    }

    // attribute
    const otherSelectedValues = realFilter.filter((param) => {
      const castedParam = castCatalogueParamToObject(param);
      return (
        castedParam.slug !== attribute.slug && castedParam.slug !== FILTER_BRAND_COLLECTION_KEY
      );
    });
    const clearSlug = `${basePath}/${otherSelectedValues.join('/')}`;

    const isSelected = castedOptions.some(({ isSelected }) => isSelected);

    const castedAttribute: CatalogueFilterAttributeInterface = {
      _id: attribute._id,
      clearSlug,
      slug: attribute.slug,
      name: getFieldStringLocale(attribute.nameI18n, locale),
      options: sortOptions(castedOptions),
      isSelected,
      childrenCount: noNaN(attribute.childrenCount),
      metric: attribute.metric ? getFieldStringLocale(attribute.metric.nameI18n, locale) : null,
      viewVariant: attribute.viewVariant,
      notShowAsAlphabet: attribute.notShowAsAlphabet || false,
      showAsCatalogueBreadcrumb: attribute.showAsCatalogueBreadcrumb,
      showAsLinkInFilter: Boolean(attribute.showAsLinkInFilter),
      showAsAccordionInFilter: Boolean(attribute.showAsAccordionInFilter),
    };

    if (isSelected) {
      selectedAttributes.push({
        ...castedAttribute,
        options: selectedFilterOptions,
      });

      // Add selected items to the catalogue title config
      const attributeSelectedOptions = selectedOptions.map((option) => {
        return filterSelectedOptions({
          option,
          attributeSlug: castedAttribute.slug,
        });
      });

      const attributeFilteredSelectedOptions = filterOptionsList(attributeSelectedOptions);
      selectedFilters.push({
        ...attribute,
        options: attributeFilteredSelectedOptions,
      });
    }

    castedAttributes.push(castedAttribute);
  }

  return {
    selectedFilters,
    selectedFilterSlugs,
    castedAttributes: visibleAttributesCount
      ? castedAttributes.slice(0, visibleAttributesCount)
      : castedAttributes,
    selectedAttributes,
  };
}

interface CastOptionsForBreadcrumbsInterface {
  option: CatalogueFilterAttributeOptionInterface;
  attribute: CatalogueFilterAttributeInterface;
  isBrand: boolean;
  currentBrand?: BrandInterface | null;
  brands?: BrandInterface[] | null;
  acc: CatalogueBreadcrumbModel[];
  hrefAcc: string;
}

function castOptionsForBreadcrumbs({
  option,
  attribute,
  currentBrand,
  isBrand,
  brands,
  acc,
  hrefAcc,
}: CastOptionsForBreadcrumbsInterface): CatalogueBreadcrumbModel[] {
  const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${option.slug}`;
  const newAcc = [...acc];
  const href = `${hrefAcc}/${optionSlug}`;
  const brand = isBrand
    ? (brands || []).find(({ itemId }) => {
        return itemId === option.slug;
      })
    : null;

  if (isBrand) {
    if (!brand?.showAsCatalogueBreadcrumb && !currentBrand) {
      return acc;
    }

    if (currentBrand) {
      const collections = currentBrand?.collections;
      const currentBrandCollection = (collections || []).find(({ itemId }) => {
        return itemId === option.slug;
      });
      if (!currentBrandCollection?.showAsCatalogueBreadcrumb) {
        return acc;
      }
    }
  }

  if (option.isSelected) {
    newAcc.push({
      _id: option._id,
      name: `${option.name}`,
      href,
    });
  }

  if (!option.options || option.options.length < 1) {
    return newAcc;
  }

  return option.options.reduce((innerAcc: CatalogueBreadcrumbModel[], childOption) => {
    const castedOptionAcc = castOptionsForBreadcrumbs({
      option: childOption,
      attribute,
      brands,
      isBrand,
      currentBrand: brand,
      acc: [],
      hrefAcc: href,
    });
    return [...innerAcc, ...castedOptionAcc];
  }, newAcc);
}

export interface GetCatalogueDataInterface {
  locale: string;
  citySlug: string;
  basePath: string;
  companySlug?: string;
  companyId?: string | ObjectIdModel | null;
  snippetVisibleAttributesCount: number;
  currency: string;
  limit: number;
  visibleCategoriesInNavDropdown: string[];
  input: {
    search?: string;
    rubricSlug?: string;
    filters: string[];
    page: number;
  };
}

export const getCatalogueData = async ({
  locale,
  citySlug,
  input,
  companyId,
  snippetVisibleAttributesCount,
  currency,
  basePath,
  visibleCategoriesInNavDropdown,
  ...props
}: GetCatalogueDataInterface): Promise<CatalogueDataInterface | null> => {
  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);

    // args
    const { rubricSlug, search } = input;
    const companySlug = props.companySlug || DEFAULT_COMPANY_SLUG;
    const searchCatalogueTitle = `Результаты поиска по запросу "${search}"`;

    // cast selected filters
    const {
      skip,
      limit,
      page,
      sortFilterOptions,
      rubricFilters,
      categoryFilters,
      inCategory,
      sortStage,
      brandStage,
      brandCollectionStage,
      optionsStage,
      pricesStage,
      realFilterAttributes,
      allUrlParams,
      searchStage,
      noSearchResults,
    } = await castUrlFilters({
      search,
      filters: input.filters,
      initialPage: input.page,
      initialLimit: props.limit,
      searchFieldName: 'productId',
    });

    // fallback
    const fallbackPayload: CatalogueDataInterface = {
      _id: new ObjectId(),
      isSearch: false,
      redirect: null,
      clearSlug: basePath,
      filters: input.filters,
      editUrl: '',
      rubricName: '',
      rubricSlug: '',
      textTopEditUrl: '',
      textBottomEditUrl: '',
      products: [],
      catalogueTitle: 'Товары не найдены',
      catalogueFilterLayout: DEFAULT_LAYOUT,
      catalogueHeadLayout: DEFAULT_LAYOUT,
      totalPages: 0,
      totalProducts: 0,
      minPrice: 0,
      maxPrice: 0,
      attributes: [],
      selectedAttributes: [],
      breadcrumbs: [],
      gridSnippetLayout: GRID_SNIPPET_LAYOUT_BIG_IMAGE,
      rowSnippetLayout: ROW_SNIPPET_LAYOUT_BIG_IMAGE,
      showSnippetConnections: true,
      showSnippetBackground: true,
      showSnippetArticle: false,
      showSnippetButtonsOnHover: false,
      gridCatalogueColumns: CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT,
      basePath,
      page,
    };

    // rubric stage
    let rubricStage: Record<any, any> = rubricSlug
      ? {
          rubricSlug,
        }
      : {};
    if (rubricFilters && rubricFilters.length > 0) {
      rubricStage = {
        rubricSlug: {
          $in: rubricFilters,
        },
      };
    }

    if (noSearchResults) {
      return {
        ...fallbackPayload,
        isSearch: true,
      };
    }

    // initial match
    const companyMatch = companyId ? { companyId: new ObjectId(companyId) } : {};
    const productsInitialMatch = {
      ...companyMatch,
      citySlug: citySlug,
      ...rubricStage,
      ...brandStage,
      ...brandCollectionStage,
      ...optionsStage,
      ...ignoreNoImageStage,
      ...pricesStage,
      ...searchStage,
    };

    // aggregate catalogue initial data
    const pipelineConfig: ProductsPaginatedAggregationInterface = {
      citySlug: citySlug,
      companySlug,
    };

    const productDataAggregationResult = await shopProductsCollection
      .aggregate<CatalogueProductsAggregationInterface>([
        // match shop products
        {
          $match: productsInitialMatch,
        },

        // group shop products by productId
        ...shopProductsGroupPipeline(pipelineConfig),

        // catalogue data facets
        {
          $facet: {
            // docs facet
            docs: shopProductDocsFacetPipeline({
              sortStage,
              skip,
              limit,
            }),

            ...productsPaginatedAggregationFacetsPipeline(pipelineConfig),
          },
        },

        // cast facets
        ...paginatedAggregationFinalPipeline(limit),
      ])
      .toArray();
    const productDataAggregation = productDataAggregationResult[0];
    if (!productDataAggregation) {
      return fallbackPayload;
    }
    // console.log('aggregation ', new Date().getTime() - timeStart);

    const { docs, totalDocs, totalPages, attributes, brands, categories, prices } =
      productDataAggregation;

    // get rubric
    let rubrics = productDataAggregation.rubrics;
    if (rubrics.length < 1) {
      rubrics = await rubricsCollection
        .aggregate<RubricInterface>([
          {
            $match: {
              slug: rubricSlug,
            },
          },
          {
            $lookup: {
              from: COL_RUBRIC_VARIANTS,
              as: 'variant',
              let: {
                variantId: '$variantId',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$$variantId', '$_id'],
                    },
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              variant: {
                $arrayElemAt: ['$variant', 0],
              },
            },
          },
        ])
        .toArray();
    }

    const rubric = rubrics[0];
    if (!rubric) {
      return fallbackPayload;
    }
    // console.log(`rubrics >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);

    // get selected categories
    const selectedCategorySlugs = categoryFilters.map((slug) => {
      const slugParts = slug.split(FILTER_SEPARATOR);
      return `${slugParts[1]}`;
    });
    const selectedCategories: CategoryInterface[] = (categories || []).filter((category) => {
      return selectedCategorySlugs.includes(category.slug);
    });

    const selectedCategoriesTree = getTreeFromList({
      list: selectedCategories,
      childrenFieldName: 'categories',
      locale,
    });

    // get page gender
    const pageGender = selectedCategoriesTree[0]?.gender || rubric.gender;

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute(currency);

    // category attribute
    let categoryAttribute: AttributeInterface[] = [];
    const showCategoriesInFilter = search ? true : Boolean(rubric.variant?.showCategoriesInFilter);
    if (categories && categories.length > 0) {
      categoryAttribute = [
        getCategoryFilterAttribute({
          locale,
          categories,
        }),
      ];
    }

    // brand attribute
    let brandAttribute: AttributeInterface[] = [];
    const showBrandInFilter = search ? true : Boolean(rubric?.showBrandInFilter);
    if (brands && brands.length > 0 && showBrandInFilter) {
      brandAttribute = [
        getBrandFilterAttribute({
          locale,
          brands: brands,
          showBrandAsAlphabet: Boolean(rubric?.showBrandAsAlphabet),
        }),
      ];
    }

    // rubric attributes
    const initialAttributes = (attributes || []).reduce((acc: AttributeInterface[], attribute) => {
      if (!attribute.showInCatalogueFilter && !realFilterAttributes.includes(attribute.slug)) {
        return acc;
      }

      return [
        ...acc,
        {
          ...attribute,
          options: getTreeFromList({
            list: attribute.options,
            childrenFieldName: 'options',
          }),
        },
      ];
    }, []);
    const rubricAttributes = inCategory
      ? initialAttributes
      : initialAttributes.filter(({ _id, slug }) => {
          const selected = realFilterAttributes.includes(slug);
          const visibleInRubric = (rubric?.filterVisibleAttributeIds || []).some((attributeId) => {
            return attributeId.equals(_id);
          });
          return selected || visibleInRubric;
        });

    // rubrics as attribute
    const rubricsAsFilters = search
      ? [
          getRubricFilterAttribute({
            rubrics,
            locale,
          }),
        ]
      : [];

    // cast catalogue attributes
    const { selectedFilters, castedAttributes, selectedAttributes, selectedFilterSlugs } =
      await getCatalogueAttributes({
        attributes: [
          ...rubricsAsFilters,
          ...categoryAttribute,
          priceAttribute,
          ...brandAttribute,
          ...rubricAttributes,
        ],
        locale,
        filters: input.filters,
        productsPrices: prices,
        basePath,
        rubricGender: search ? GENDER_HE : pageGender,
        brands,
        // visibleAttributesCount,
      });
    // console.log(`getCatalogueAttributes >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);

    // cast catalogue products
    const products: ShopProductInterface[] = [];
    docs.forEach((shopProduct) => {
      const summary = shopProduct.summary;
      if (!summary) {
        return;
      }

      const castedSummary = castSummaryForUI({
        summary: summary,
        attributes,
        locale,
      });

      // list features
      const initialListAttributes = getProductCurrentViewCastedAttributes({
        attributes: castedSummary.attributes || [],
        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
        locale,
      });
      const listAttributes = sortObjectsByField(
        initialListAttributes
          .filter(({ attribute }) => {
            return attribute?.showInSnippet;
          })
          .slice(0, snippetVisibleAttributesCount),
        'attribute.name',
      );

      // rating features
      /*const initialRatingAttributes = getProductCurrentViewCastedAttributes({
        attributes: castedSummary.attributes || [],
        viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
        locale,
      });
      const ratingAttributes = initialRatingAttributes.filter(({ attribute }) => {
        return attribute?.showInSnippet;
      });*/

      const finalShopProduct: ShopProductInterface = {
        ...shopProduct,
        filterSlugs: [],
        brandSlug: undefined,
        brandCollectionSlug: undefined,
        manufacturerSlug: undefined,
        summary: {
          ...castedSummary,
          filterSlugs: [],
          attributes: [],
          attributeIds: [],
          categories: undefined,
          assets: [],
          variants: [],
          snippetTitleI18n: {},
          cardTitleI18n: {},
          cardTitle: undefined,
          titleCategorySlugs: [],
          descriptionI18n: {},
          videos: undefined,
          brandSlug: undefined,
          brandCollectionSlug: undefined,
          manufacturerSlug: undefined,
          originalName: '',
          nameI18n: undefined,
          listAttributes,
          // ratingAttributes,
          shopsCount: shopProduct.shopsIds?.length,
          shopProductIds: shopProduct.shopProductIds,
          minPrice: noNaN(shopProduct.minPrice),
          maxPrice: noNaN(shopProduct.maxPrice),
        },
      };
      products.push(finalShopProduct);
    });

    // get catalogue title
    const catalogueTitle = search
      ? searchCatalogueTitle
      : generateTitle({
          positionFieldName: 'positioningInTitle',
          attributeNameVisibilityFieldName: 'showNameInTitle',
          attributeVisibilityFieldName: 'showInCatalogueTitle',
          defaultGender: rubric.gender,
          fallbackTitle: getFieldStringLocale(rubric.defaultTitleI18n, locale),
          defaultKeyword: getFieldStringLocale(rubric.keywordI18n, locale),
          prefix: getFieldStringLocale(rubric.prefixI18n, locale),
          attributes: selectedFilters,
          capitaliseKeyWord: rubric.capitalise,
          categories,
          locale,
          currency,
          page,
        });
    // console.log(`catalogueTitle >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

    // get catalogue breadcrumbs
    const rubricName = search ? 'Результат поиска' : getFieldStringLocale(rubric.nameI18n, locale);
    const breadcrumbs: CatalogueBreadcrumbModel[] = [
      {
        _id: rubric._id,
        name: rubricName,
        href: basePath,
      },
    ];

    selectedAttributes.forEach((selectedAttribute) => {
      const { options, showAsCatalogueBreadcrumb, slug } = selectedAttribute;
      const isPrice = slug === FILTER_PRICE_KEY;
      const isBrand = slug === FILTER_BRAND_KEY;

      if ((showAsCatalogueBreadcrumb || isPrice || isBrand) && rubricSlug) {
        const optionBreadcrumbs = options.reduce((acc: CatalogueBreadcrumbModel[], option) => {
          const tree = castOptionsForBreadcrumbs({
            option: option,
            isBrand,
            brands,
            attribute: selectedAttribute,
            hrefAcc: `${ROUTE_CATALOGUE}/${rubricSlug}`,
            acc: [],
          });
          return [...acc, ...tree];
        }, []);

        optionBreadcrumbs.forEach((options) => {
          breadcrumbs.push(options);
        });
      }
    });

    // get clearSlug
    const clearPath = [...categoryFilters, sortPathname]
      .filter((pathPart) => {
        return pathPart;
      })
      .join('/');
    let clearSlug = `${basePath}/${clearPath}`;
    if (search) {
      clearSlug = basePath;
    }

    // get seo texts
    let editUrl = '';
    let textTopEditUrl = '';
    let textBottomEditUrl = '';
    let textTop: SeoContentInterface | null | undefined;
    let textBottom: SeoContentInterface | null | undefined;

    if (!search) {
      const seoContentParams = await getCatalogueAllSeoContents({
        rubricSlug: rubric.slug,
        citySlug: citySlug,
        companySlug: companySlug,
        filters: input.filters,
        locale,
      });

      if (seoContentParams) {
        const { seoContentTop, seoContentBottom } = seoContentParams;
        textTop = seoContentTop;
        textBottom = seoContentBottom;
        textTopEditUrl = seoContentParams.textTopEditUrl;
        textBottomEditUrl = seoContentParams.textBottomEditUrl;
        editUrl = seoContentParams.editUrl;
      }
    }

    // get layout configs
    const catalogueFilterLayout = search
      ? DEFAULT_LAYOUT
      : rubric.variant?.catalogueFilterLayout || DEFAULT_LAYOUT;

    const catalogueHeadLayout = search
      ? DEFAULT_LAYOUT
      : rubric.variant?.catalogueHeadLayout || DEFAULT_LAYOUT;

    const gridSnippetLayout = search
      ? GRID_SNIPPET_LAYOUT_BIG_IMAGE
      : rubric.variant?.gridSnippetLayout || DEFAULT_LAYOUT;

    const rowSnippetLayout = search
      ? ROW_SNIPPET_LAYOUT_BIG_IMAGE
      : rubric.variant?.rowSnippetLayout || DEFAULT_LAYOUT;

    const showSnippetConnections = search ? true : rubric.variant?.showSnippetConnections || false;

    const showSnippetBackground = search ? true : rubric.variant?.showSnippetBackground || false;

    const showSnippetArticle = search ? false : rubric.variant?.showSnippetArticle || false;

    const showSnippetButtonsOnHover = search
      ? false
      : rubric.variant?.showSnippetButtonsOnHover || false;

    const gridCatalogueColumns = search
      ? CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT
      : rubric.variant?.gridCatalogueColumns || CATALOGUE_GRID_DEFAULT_COLUMNS_COUNT;

    // get head categories
    let visibleHeadCategoryIds: ObjectIdModel[] = [];
    visibleCategoriesInNavDropdown.forEach((configString) => {
      const configParts = configString.split(FILTER_SEPARATOR);
      const rubricId = configParts[0] ? new ObjectId(`${configParts[0]}`) : null;
      const categoryId = configParts[1] ? new ObjectId(`${configParts[1]}`) : null;
      if (rubricId && categoryId && rubricId.equals(rubric._id)) {
        visibleHeadCategoryIds.push(categoryId);
      }
    });
    const visibleCategories = (categories || []).filter(({ _id }) => {
      return visibleHeadCategoryIds.some((visibleId) => visibleId.equals(_id));
    });
    const categoriesTree = getTreeFromList({
      list: visibleCategories,
      childrenFieldName: 'categories',
      gender: pageGender,
      locale,
    });
    const selectedCategoryLeafIds = getSelectedCategoryLeaf({
      acc: [],
      selectedCategoriesTree,
    });
    const headCategories: CategoryInterface[] = [];
    selectedCategoryLeafIds.forEach((parentId) => {
      const categoryTreeList = getTreeFromList<CategoryInterface>({
        list: visibleCategories,
        childrenFieldName: 'categories',
        gender: pageGender,
        parentId,
        locale,
      });
      categoryTreeList.forEach((childCategory) => {
        headCategories.push({
          ...childCategory,
          name: childCategory.name,
          categories: [],
        });
      });
    });
    if (selectedCategoryLeafIds.length < 1) {
      (categoriesTree || []).forEach((category) => {
        headCategories.push({
          ...category,
          categories: [],
          name: getFieldStringLocale(category.nameI18n, locale),
        });
      });
    }

    const finalFilterAttributes = showCategoriesInFilter
      ? castedAttributes
      : castedAttributes.filter(({ slug }) => {
          return slug !== FILTER_CATEGORY_KEY;
        });
    const finalSortedFilterAttributes = finalFilterAttributes.sort((a, b) => {
      const aCounter = a.showAsAccordionInFilter ? 1 : 0;
      const bCounter = b.showAsAccordionInFilter ? 1 : 0;
      return aCounter - bCounter;
    });

    const finalSelectedAttributes = showCategoriesInFilter
      ? selectedAttributes
      : selectedAttributes.filter(({ slug }) => {
          return slug !== FILTER_CATEGORY_KEY;
        });

    let redirect = null;
    const lostFilters: string[] = [];
    allUrlParams.forEach((filter) => {
      const splittedOption = filter.split(FILTER_SEPARATOR);
      const attributeSlug = splittedOption[0];
      if (
        attributeSlug === FILTER_PAGE_KEY ||
        attributeSlug === CATALOGUE_FILTER_LIMIT ||
        attributeSlug === SORT_BY_KEY ||
        attributeSlug === SORT_DIR_KEY
      ) {
        return;
      }
      if (!selectedFilterSlugs.some((slug) => slug === filter)) {
        lostFilters.push(filter);
      }
    });

    const lostNestedFilters: string[] = [];
    selectedFilterSlugs.forEach((filter) => {
      const splittedOption = filter.split(FILTER_SEPARATOR);
      const attributeSlug = splittedOption[0];
      if (
        attributeSlug === FILTER_PAGE_KEY ||
        attributeSlug === CATALOGUE_FILTER_LIMIT ||
        attributeSlug === SORT_BY_KEY ||
        attributeSlug === SORT_DIR_KEY
      ) {
        return;
      }
      if (!allUrlParams.some((slug) => slug === filter)) {
        lostNestedFilters.push(filter);
      }
    });

    const isRedirect = lostFilters.length > 0 || lostNestedFilters.length > 0;
    const isPageRedirect =
      input.filters.includes(ZERO_PAGE_FILTER) || input.filters.includes(DEFAULT_PAGE_FILTER);
    if (isRedirect || isPageRedirect) {
      const filteredRedirectArray = selectedFilterSlugs.filter((filter) => {
        return filter !== ZERO_PAGE_FILTER && !lostFilters.includes(filter);
      });
      const sortedRedirectArray = sortStringArray(filteredRedirectArray);
      redirect = `/${sortedRedirectArray.join('/')}`;
    }

    // get min and max prices
    const sortedPrices = [...prices].sort((a, b) => {
      return a._id - b._id;
    });
    let minPriceObject = sortedPrices[0];
    if (minPriceObject._id === 0) {
      minPriceObject = sortedPrices[1];
    }
    const maxPriceObject = sortedPrices[sortedPrices.length - 1];
    const minPrice = noNaN(minPriceObject?._id);
    const maxPrice = noNaN(maxPriceObject?._id);
    // console.log(`Catalogue data >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);

    return {
      // rubric
      _id: rubric._id,
      redirect,
      rubricName,
      rubricSlug: rubric.slug,
      editUrl,
      isSearch: Boolean(search),

      // products
      products,

      // configs
      catalogueFilterLayout,
      catalogueHeadLayout,
      gridSnippetLayout,
      rowSnippetLayout,
      showSnippetConnections,
      showSnippetBackground,
      showSnippetArticle,
      showSnippetButtonsOnHover,
      gridCatalogueColumns,

      // filter
      headCategories,
      totalPages,
      totalProducts: noNaN(totalDocs),
      attributes: finalSortedFilterAttributes,
      selectedAttributes: finalSelectedAttributes,
      page,
      basePath,
      clearSlug,
      filters: input.filters,

      //seo
      textTop,
      textTopEditUrl,
      textBottom,
      textBottomEditUrl,
      catalogueTitle: textTop && textTop.title ? textTop.title : catalogueTitle,
      breadcrumbs,
      minPrice,
      maxPrice,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export async function getCatalogueProps(
  context: GetServerSidePropsContext<any>,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
  // const timeStart = new Date().getTime();
  const { props } = await getSiteInitialData({
    context,
  });
  // console.log('getCatalogueProps ', new Date().getTime() - timeStart);
  const rubricSlug = context.query?.rubricSlug;

  const notFoundResponse = {
    props: {
      ...props,
      route: '',
      showForIndex: false,
      noIndexFollow: false,
    },
    notFound: true,
  };

  if (!rubricSlug) {
    return notFoundResponse;
  }

  // redirect to the sorted url path
  const filters = alwaysArray(context.query?.filters);
  const sortedFilters = sortStringArray(filters);
  const filtersPath = filters.join('/');
  const sortedFiltersPath = sortedFilters.join('/');
  const basePath = `${ROUTE_CATALOGUE}/${rubricSlug}`;
  if (filtersPath !== sortedFiltersPath) {
    return {
      redirect: {
        permanent: true,
        destination: `${basePath}/${sortedFiltersPath}`,
      },
    };
  }

  // catalogue
  const asPath = `${basePath}/${sortedFiltersPath}`;

  const rawCatalogueData = await getCatalogueData({
    locale: props.sessionLocale,
    citySlug: props.citySlug,
    companySlug: props.domainCompany?.slug,
    companyId: props.domainCompany?._id,
    currency: props.initialData.currency,
    basePath,
    snippetVisibleAttributesCount: props.initialData.configs.snippetAttributesCount,
    visibleCategoriesInNavDropdown: props.initialData.configs.visibleCategoriesInNavDropdown,
    limit: props.initialData.configs.catalogueProductsCount,
    input: {
      rubricSlug: `${rubricSlug}`,
      filters,
      page: 1,
    },
  });
  // console.log('getCatalogueData ', new Date().getTime() - timeStart);

  if (!rawCatalogueData) {
    return {
      redirect: {
        permanent: true,
        destination: `/`,
      },
    };
  }

  if (!rawCatalogueData.isSearch && rawCatalogueData.products.length < 1 && filters.length > 0) {
    return {
      redirect: {
        permanent: true,
        destination: `${rawCatalogueData.basePath}`,
      },
    };
  }

  if (rawCatalogueData.products.length < 1) {
    return notFoundResponse;
  }

  if (rawCatalogueData.redirect) {
    return {
      redirect: {
        permanent: true,
        destination: `${rawCatalogueData.basePath}${rawCatalogueData.redirect}`,
      },
    };
  }

  /*seo*/
  const getSafeUrl = (url: string) => {
    return url
      .split('/')
      .filter((path) => {
        return path;
      })
      .join('/');
  };
  const noIndexFollow = rawCatalogueData.page > 1;
  const showForIndex =
    getSafeUrl(basePath) === getSafeUrl(asPath) && !noIndexFollow
      ? true
      : Boolean(rawCatalogueData.textTop?.showForIndex);
  // console.log('seo ', new Date().getTime() - timeStart);

  /*seo schema*/
  const siteUrl = `https://${props.domain}`;
  const pageUrl = `${siteUrl}${asPath}`;
  const seoSchemaBreadcrumbs: SeoSchemaBreadcrumbItemInterface[] = rawCatalogueData.breadcrumbs.map(
    ({ href, name }, index) => {
      return {
        '@type': 'ListItem',
        position: index + 2,
        name,
        item: `${pageUrl}${href}`,
      };
    },
  );
  const seoSchema: SeoSchemaCatalogueInterface = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    '@graph': [
      {
        '@type': 'Product',
        name: rawCatalogueData.catalogueTitle,
        offers: {
          '@type': 'AggregateOffer',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          priceCurrency: 'RUB',
          lowPrice: `${rawCatalogueData.minPrice}`,
          highPrice: `${rawCatalogueData.maxPrice}`,
          url: pageUrl,
          offerCount: `${rawCatalogueData.totalProducts}`,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Главная',
            item: pageUrl,
          },
          ...seoSchemaBreadcrumbs,
        ],
      },
    ],
  };

  // set cache
  context.res.setHeader(
    'Cache-Control',
    `public, max-age=60, s-maxage=300, stale-while-revalidate=60`,
  );

  return {
    props: {
      ...props,
      catalogueData: castDbData(rawCatalogueData),
      showForIndex,
      noIndexFollow,
      seoSchema: `<script type="application/ld+json">${JSON.stringify(seoSchema)}</script>`,
    },
  };
}
