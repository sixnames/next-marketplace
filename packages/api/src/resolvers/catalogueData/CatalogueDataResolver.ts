import { noNaN } from '../../utils/numbers';
import { Arg, Query, Resolver } from 'type-graphql';
import {
  CatalogueData,
  CatalogueFilterAttribute,
  CatalogueFilterAttributeOption,
  CatalogueFilterSelectedPrices,
  CatalogueSearchResult,
} from '../../entities/CatalogueData';
import { Rubric, RubricModel } from '../../entities/Rubric';
import { Product, ProductModel } from '../../entities/Product';
import {
  attributesReducer,
  getAttributesPipeline,
  getCatalogueAdditionalFilterOptions,
  getCatalogueAttribute,
  getCatalogueTitle,
  getOptionFromParam,
  GetOptionFromParamPayloadInterface,
  getParamOptionFirstValueByKey,
  getParamOptionValueByKey,
  setCataloguePriorities,
} from '../../utils/catalogueHelpers';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { Role } from '../../entities/Role';
import {
  CATALOGUE_BRAND_COLLECTION_KEY,
  CATALOGUE_BRAND_KEY,
  CATALOGUE_FILTER_EXCLUDED_KEYS,
  CATALOGUE_MANUFACTURER_KEY,
  CATALOGUE_MAX_PRICE_KEY,
  CATALOGUE_MIN_PRICE_KEY,
  CATALOGUE_PRODUCTS_LIMIT,
  LANG_NOT_FOUND_FIELD_MESSAGE,
  PAGE_DEFAULT,
  SORT_ASC_NUM,
  SORT_BY_KEY,
  SORT_DESC,
  SORT_DESC_NUM,
  SORT_DIR_KEY,
} from '@yagu/shared';
import { CatalogueProductsInput, CatalogueProductsSortByEnum } from './CatalogueProductsInput';
import { SortDirectionEnum } from '../commonInputs/PaginateInput';
import { getRubricsTreeIds } from '../../utils/rubricHelpers';
import { paginationTotalStages } from '../../utils/aggregatePagination';
import { Types } from 'mongoose';
import { getObjectIdsArray } from '../../utils/getObjectIdsArray';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import { Option, OptionModel } from '../../entities/Option';
import { alwaysArray } from '../../utils/alwaysArray';
import { getCurrencyString } from '../../utils/intl';

@Resolver((_of) => CatalogueData)
export class CatalogueDataResolver {
  @Query(() => CatalogueData, { nullable: true })
  async getCatalogueData(
    @SessionRole() sessionRole: Role,
    @Localization() { lang, city, getLangField }: LocalizationPayloadInterface,
    @Arg('catalogueFilter', (_type) => [String])
    catalogueFilter: string[],
    @Arg('productsInput', {
      nullable: true,
      defaultValue: {
        limit: CATALOGUE_PRODUCTS_LIMIT,
        page: 1,
        sortBy: 'priority',
        sortDir: SORT_DESC,
      },
    })
    productsInput: CatalogueProductsInput,
  ): Promise<CatalogueData | null> {
    try {
      const [slug, ...params] = catalogueFilter;
      const additionalFilters: GetOptionFromParamPayloadInterface[] = [];

      const paramsAttributes = params.filter((param) => {
        const paramObject = getOptionFromParam(param);
        const excluded = CATALOGUE_FILTER_EXCLUDED_KEYS.includes(paramObject.key);
        if (excluded) {
          additionalFilters.push(paramObject);
          return false;
        }
        return true;
      });

      const { limit = CATALOGUE_PRODUCTS_LIMIT, page = 1 } = productsInput;

      const sortBy = getParamOptionFirstValueByKey({
        defaultValue: 'priority',
        paramOptions: additionalFilters,
        key: SORT_BY_KEY,
      });
      const sortDir = getParamOptionFirstValueByKey({
        defaultValue: SORT_DESC,
        paramOptions: additionalFilters,
        key: SORT_DIR_KEY,
      });
      const minPrice = getParamOptionFirstValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_MIN_PRICE_KEY,
      });
      const maxPrice = getParamOptionFirstValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_MAX_PRICE_KEY,
      });
      const skip = page ? (page - 1) * limit : 0;
      const realSortDir = sortDir === SORT_DESC ? SORT_DESC_NUM : SORT_ASC_NUM;

      // get current rubric
      const rubric = await RubricModel.findOne({ slug });

      if (!rubric) {
        return null;
      }

      // get all nested rubrics
      const rubricsIds = await getRubricsTreeIds(rubric._id);
      const { attributesGroups } = rubric;
      const rubricIdString = rubric.id.toString();

      // cast all filters from input
      const processedAttributes = paramsAttributes.reduce(attributesReducer, []);

      // increase filter priority
      const attributesGroupsIds = rubric.attributesGroups.map(({ node }) => node);

      // TODO update views in brands, manufacturers and brandCollections
      await setCataloguePriorities({
        attributesGroupsIds,
        rubric: rubric,
        processedAttributes,
        isStuff: sessionRole.isStuff,
        city,
      });

      // get catalogue title
      const catalogueTitle = await getCatalogueTitle({
        processedAttributes,
        lang,
        rubric,
      });

      const selectedAttributesPipeline = getAttributesPipeline(processedAttributes);

      const attributesMatch =
        processedAttributes.length > 0
          ? {
              $and: selectedAttributesPipeline,
            }
          : {};

      // All products pipeline
      const allProductsPipeline = [
        // Initial match
        {
          $match: {
            ...attributesMatch,
            rubrics: { $in: rubricsIds },
            active: true,
          },
        },

        // Lookup shop products
        { $addFields: { productId: { $toString: '$_id' } } },
        {
          $lookup: {
            from: 'shopproducts',
            localField: 'productId',
            foreignField: 'product',
            as: 'shops',
          },
        },

        // Count shop products
        { $addFields: { shopsCount: { $size: '$shops' } } },

        // Filter out products not added to the shops
        { $match: { shopsCount: { $gt: 0 } } },

        // Add minPrice field
        { $addFields: { minPrice: { $min: '$shops.price' } } },

        // Unwind by views counter
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },

        // Filter unwinded products by current city or empty views
        { $match: { $or: [{ 'views.key': city }, { 'views.key': { $exists: false } }] } },
      ];

      // Sort pipeline
      // sort by priority/views (default)
      const sortByIdDirection = -1;
      let sortPipeline: any[] = [
        { $sort: { 'views.counter': realSortDir, _id: sortByIdDirection } },
      ];

      // sort by price
      if (sortBy === 'price') {
        sortPipeline = [{ $sort: { minPrice: realSortDir, _id: sortByIdDirection } }];
      }

      // sort by create date
      if (sortBy === 'createdAt') {
        sortPipeline = [{ $sort: { createdAt: realSortDir, _id: sortByIdDirection } }];
      }

      // price range pipeline
      const priceRangePipeline =
        minPrice && maxPrice
          ? [
              {
                $match: {
                  minPrice: {
                    $gte: noNaN(minPrice),
                    $lte: noNaN(maxPrice),
                  },
                },
              },
            ]
          : [];

      interface ProductsAggregationInterface {
        docs: Product[];
        totalDocs: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        minPrice: {
          _id: number;
        }[];
        maxPrice: {
          _id: number;
        }[];
      }

      const productsAggregation = await ProductModel.aggregate<ProductsAggregationInterface>([
        ...allProductsPipeline,

        // Facets for pagination fields
        {
          $facet: {
            docs: [...priceRangePipeline, ...sortPipeline, { $skip: skip }, { $limit: limit }],
            countAllDocs: [...priceRangePipeline, { $count: 'totalDocs' }],
            minPrice: [{ $group: { _id: '$minPrice' } }, { $sort: { _id: 1 } }, { $limit: 1 }],
            maxPrice: [{ $group: { _id: '$minPrice' } }, { $sort: { _id: -1 } }, { $limit: 1 }],
          },
        },
        ...paginationTotalStages(limit),
        {
          $project: {
            docs: 1,
            totalDocs: 1,
            totalPages: 1,
            minPrice: 1,
            maxPrice: 1,
            hasPrevPage: {
              $gt: [page, PAGE_DEFAULT],
            },
            hasNextPage: {
              $lt: [page, '$totalPages'],
            },
          },
        },
      ]);

      const productsResult = productsAggregation[0] ?? { docs: [] };
      const { totalDocs, totalPages } = productsResult;
      const minPriceResult = noNaN(productsResult.minPrice[0]?._id);
      const maxPriceResult = noNaN(productsResult.maxPrice[0]?._id);

      // get all visible attributes id's
      const visibleAttributes = attributesGroups.reduce((acc: Types.ObjectId[], group) => {
        return [...acc, ...getObjectIdsArray(group.showInCatalogueFilter)];
      }, []);

      const attributes = await AttributeModel.aggregate<Attribute>([
        { $match: { _id: { $in: visibleAttributes } } },
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
        { $match: { $or: [{ 'views.key': city }, { 'views.key': { $exists: false } }] } },
        {
          $addFields: {
            viewsCounter: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: ['$views.key', city],
                    },
                    {
                      $eq: ['$views.rubricId', rubricIdString],
                    },
                  ],
                },
                then: '$views.counter',
                else: 0,
              },
            },
          },
        },
        { $sort: { viewsCounter: -1 } },
      ]);

      const reducedAttributes = attributes.reduce((acc: Attribute[], attribute) => {
        const { _id } = attribute;
        const exist = acc.find(({ _id: existingId }) => {
          return existingId?.toString() === _id?.toString();
        });
        if (exist) {
          return acc;
        }
        return [...acc, attribute];
      }, []);

      const filterAttributes: CatalogueFilterAttribute[] = [];

      for await (const attribute of reducedAttributes) {
        const attributeIdString = attribute._id?.toString();
        const optionsGroup = await OptionsGroupModel.findById(attribute.optionsGroup);
        if (!optionsGroup) {
          continue;
        }

        const options = await OptionModel.aggregate<Option>([
          { $match: { _id: { $in: optionsGroup.options } } },
          { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
          { $match: { $or: [{ 'views.key': city }, { 'views.key': { $exists: false } }] } },
          {
            $addFields: {
              viewsCounter: {
                $cond: {
                  if: {
                    $and: [
                      {
                        $eq: ['$views.key', city],
                      },
                      {
                        $eq: ['$views.rubricId', rubricIdString],
                      },
                      {
                        $eq: ['$views.attributeId', attributeIdString],
                      },
                    ],
                  },
                  then: '$views.counter',
                  else: 0,
                },
              },
            },
          },
          { $sort: { viewsCounter: SORT_DESC_NUM } },
        ]);

        const reducedOptions = options.reduce((acc: Option[], option) => {
          const { _id } = option;
          const exist = acc.find(({ _id: existingId }) => {
            return existingId?.toString() === _id?.toString();
          });
          if (exist) {
            return acc;
          }
          return [...acc, option];
        }, []);

        const resultOptions: CatalogueFilterAttributeOption[] = [];

        for await (const option of reducedOptions) {
          const { variants, name } = option;
          let filterNameString: string;
          const currentVariant = variants?.find(({ key }) => key === rubric.catalogueTitle.gender);
          const currentVariantName = getLangField(currentVariant?.value);
          if (currentVariantName === LANG_NOT_FOUND_FIELD_MESSAGE) {
            filterNameString = getLangField(name);
          } else {
            filterNameString = currentVariantName;
          }

          const optionSlug = `${attribute.slug}-${option.slug}`;
          const isSelected = catalogueFilter.includes(optionSlug);
          const optionNextSlug = isSelected
            ? catalogueFilter
                .filter((pathArg) => {
                  return pathArg !== optionSlug;
                })
                .join('/')
            : [...catalogueFilter, optionSlug].join('/');

          // Count products with current option
          const products = await ProductModel.aggregate<any>([
            ...allProductsPipeline,

            // Option products match
            {
              $match: {
                'attributesGroups.attributes': {
                  $elemMatch: {
                    key: attribute.slug,
                    value: { $in: [option.slug] },
                  },
                },
              },
            },

            // Filter out products that out of price range
            ...priceRangePipeline,

            {
              $count: 'counter',
            },
          ]);
          const counter = products[0]?.counter || 0;

          resultOptions.push({
            id: option._id?.toString() + rubricIdString,
            nameString: filterNameString,
            optionNextSlug: `/${optionNextSlug}`,
            isSelected,
            isDisabled: counter < 1,
            counter,
          });
        }

        const filterAttribute = await getCatalogueAttribute({
          id: attributeIdString + rubricIdString,
          nameString: getLangField(attribute.name),
          options: resultOptions,
          catalogueFilter,
          catalogueFilterExcludeKey: attribute.slug,
        });
        filterAttributes.push(filterAttribute);
      }

      // Casted additional filters
      const brandsInArguments = getParamOptionValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_BRAND_KEY,
      });
      const brandCollectionsInArguments = getParamOptionValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_BRAND_COLLECTION_KEY,
      });
      const manufacturersInArguments = getParamOptionValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_MANUFACTURER_KEY,
      });

      // Additional filters matchers
      const brandsMatch =
        brandsInArguments.length > 0 ? [{ $match: { brand: { $in: brandsInArguments } } }] : [];

      const brandCollectionsMatch =
        brandCollectionsInArguments.length > 0
          ? [{ $match: { brandCollection: { $in: brandCollectionsInArguments } } }]
          : [];

      const manufacturersMatch =
        manufacturersInArguments.length > 0
          ? [{ $match: { manufacturer: { $in: manufacturersInArguments } } }]
          : [];

      // Brands
      const brandOptions = await getCatalogueAdditionalFilterOptions({
        allProductsPipeline: [
          ...allProductsPipeline,
          ...brandCollectionsMatch,
          ...manufacturersMatch,
        ],
        productForeignField: '$brand',
        collectionSlugs: brandsInArguments,
        filterKey: CATALOGUE_BRAND_KEY,
        collection: 'brands',
        catalogueFilterArgs: catalogueFilter,
        rubricsIds,
        city,
      });
      // TODO nameString
      const brandsAttribute = await getCatalogueAttribute({
        id: CATALOGUE_BRAND_KEY,
        nameString: 'Бренды',
        options: brandOptions,
        catalogueFilter,
        catalogueFilterExcludeKey: CATALOGUE_BRAND_KEY,
      });

      // Brand collections
      const brandCollectionOptions = await getCatalogueAdditionalFilterOptions({
        allProductsPipeline: [...allProductsPipeline, ...brandsMatch, ...manufacturersMatch],
        productForeignField: '$brandCollection',
        collectionSlugs: brandCollectionsInArguments,
        filterKey: CATALOGUE_BRAND_KEY,
        collection: 'brandcollections',
        catalogueFilterArgs: catalogueFilter,
        rubricsIds,
        city,
      });
      // TODO nameString
      const brandCollectionsAttribute = await getCatalogueAttribute({
        id: CATALOGUE_BRAND_COLLECTION_KEY,
        nameString: 'Линейки',
        options: brandCollectionOptions,
        catalogueFilter,
        catalogueFilterExcludeKey: CATALOGUE_BRAND_COLLECTION_KEY,
      });

      // Manufacturers
      const manufacturerOptions = await getCatalogueAdditionalFilterOptions({
        allProductsPipeline: [...allProductsPipeline, ...brandCollectionsMatch, ...brandsMatch],
        productForeignField: '$manufacturer',
        collectionSlugs: manufacturersInArguments,
        filterKey: CATALOGUE_MANUFACTURER_KEY,
        collection: 'manufacturers',
        catalogueFilterArgs: catalogueFilter,
        rubricsIds,
        city,
      });
      // TODO nameString
      const manufacturersAttribute = await getCatalogueAttribute({
        id: CATALOGUE_MANUFACTURER_KEY,
        nameString: 'Производители',
        options: manufacturerOptions,
        catalogueFilter,
        catalogueFilterExcludeKey: CATALOGUE_MANUFACTURER_KEY,
      });

      // Final attributes list
      const finalAttributes = [
        ...filterAttributes,
        brandsAttribute,
        brandCollectionsAttribute,
        manufacturersAttribute,
      ];

      // Get selected attributes
      const selectedAttributes = finalAttributes.reduce(
        (acc: CatalogueFilterAttribute[], attribute) => {
          if (!attribute.isSelected) {
            return acc;
          }
          return [
            ...acc,
            {
              ...attribute,
              id: `selected-${attribute.id}`,
              options: attribute.options.filter((option) => {
                return option.isSelected;
              }),
            },
          ];
        },
        [],
      );

      // Get selected prices
      const selectedPrices: CatalogueFilterSelectedPrices | null =
        minPrice && maxPrice
          ? {
              id: `${rubric.slug}-selectedPrices`,
              clearSlug: `/${alwaysArray(catalogueFilter).join('/')}`,
              formattedMinPrice: getCurrencyString({ lang, value: minPrice }),
              formattedMaxPrice: getCurrencyString({ lang, value: maxPrice }),
            }
          : null;

      return {
        id: `catalogueData-${rubric.id}`,
        rubric,
        catalogueTitle,
        minPrice: minPriceResult,
        maxPrice: maxPriceResult,
        products: {
          docs: productsResult.docs,
          page,
          totalDocs,
          totalPages,
          limit,
          sortBy: sortBy as CatalogueProductsSortByEnum,
          sortDir: sortDir as SortDirectionEnum,
        },
        catalogueFilter: {
          id: `catalogueFilter-${rubric.id}`,
          attributes: finalAttributes,
          selectedAttributes,
          selectedPrices,
          clearSlug: `/${rubric.slug}`,
        },
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Query((_returns) => CatalogueSearchResult)
  async getCatalogueSearchTopItems(
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<CatalogueSearchResult> {
    try {
      const searchPipeLine = [
        {
          $match: {
            active: true,
          },
        },
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            id: '$_id',
            viewsCounter: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: ['$views.key', city],
                    },
                  ],
                },
                then: '$views.counter',
                else: 0,
              },
            },
          },
        },
        { $sort: { viewsCounter: -1 } },
        { $limit: 3 },
      ];

      const products = await ProductModel.aggregate<Product>(searchPipeLine);
      const rubrics = await RubricModel.aggregate<Rubric>(searchPipeLine);

      return {
        products,
        rubrics,
      };
    } catch (e) {
      return {
        products: [],
        rubrics: [],
      };
    }
  }

  @Query((_returns) => CatalogueSearchResult)
  async getCatalogueSearchResult(
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('search', (_type) => String) search: string,
  ): Promise<CatalogueSearchResult> {
    try {
      const searchPipeLine = [
        {
          $match: {
            $text: {
              $search: search,
              $caseSensitive: false,
            },
            active: true,
          },
        },
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            id: '$_id',
            viewsCounter: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: ['$views.key', city],
                    },
                  ],
                },
                then: '$views.counter',
                else: 0,
              },
            },
          },
        },
        { $sort: { viewsCounter: -1 } },
        { $limit: 3 },
      ];

      const products = await ProductModel.aggregate<Product>(searchPipeLine);
      const rubrics = await RubricModel.aggregate<Rubric>(searchPipeLine);

      return {
        products,
        rubrics,
      };
    } catch (e) {
      return {
        products: [],
        rubrics: [],
      };
    }
  }
}
