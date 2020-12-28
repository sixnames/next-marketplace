import { noNaN } from '../../utils/numbers';
import { Arg, Query, Resolver } from 'type-graphql';
import {
  CatalogueData,
  CatalogueFilterAttribute,
  CatalogueSearchResult,
} from '../../entities/CatalogueData';
import {
  Rubric,
  RubricFilterAttribute,
  RubricFilterAttributeOption,
  RubricFilterSelectedPrices,
  RubricModel,
} from '../../entities/Rubric';
import { Product, ProductModel } from '../../entities/Product';
import {
  attributesReducer,
  getAttributesPipeline,
  getCatalogueTitle,
  getOptionFromParam,
  GetOptionFromParamPayloadInterface,
  getParamOptionFirstValueByKey,
  setCataloguePriorities,
} from '../../utils/catalogueHelpers';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionRole,
} from '../../decorators/parameterDecorators';
import { Role } from '../../entities/Role';
import {
  CATALOGUE_FILTER_EXCLUDED_KEYS,
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
import { getBooleanFromArray } from '../../utils/getBooleanFromArray';
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

      const attributesMatch =
        processedAttributes.length > 0
          ? {
              $and: getAttributesPipeline(processedAttributes),
            }
          : {};

      // pipeline
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

        const resultOptions: RubricFilterAttributeOption[] = [];

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
            // Initial products match
            {
              $match: {
                rubrics: { $in: rubricsIds },
                active: true,
                'attributesGroups.attributes': {
                  $elemMatch: {
                    key: attribute.slug,
                    value: { $in: [option.slug] },
                  },
                },
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

            // Filter out products that out of price range
            ...priceRangePipeline,

            {
              $count: 'counter',
            },
          ]);
          const counter = products[0]?.counter || 0;

          resultOptions.push({
            ...option,
            id: option._id?.toString() + rubricIdString,
            filterNameString: filterNameString,
            optionSlug,
            optionNextSlug: `/${optionNextSlug}`,
            isSelected,
            isDisabled: counter < 1,
            counter,
          });
        }

        const otherAttributesSelectedValues = catalogueFilter.filter((option) => {
          return !option.includes(attribute.slug);
        });
        const clearSlug = `/${otherAttributesSelectedValues.join('/')}`;

        const isSelected = getBooleanFromArray(resultOptions, ({ isSelected }) => {
          return isSelected;
        });

        const sortedOptions = resultOptions.sort((optionA, optionB) => {
          const isDisabledA = optionA.isDisabled ? 0 : 1;
          const isDisabledB = optionB.isDisabled ? 0 : 1;

          return isDisabledB - isDisabledA;
        });

        const disabledOptionsCount = sortedOptions.reduce((acc: number, { isDisabled }) => {
          if (isDisabled) {
            return acc + 1;
          }
          return acc;
        }, 0);

        filterAttributes.push({
          id: attributeIdString + rubricIdString,
          node: attribute,
          options: sortedOptions,
          clearSlug: `${clearSlug}`,
          isSelected,
          isDisabled: disabledOptionsCount === sortedOptions.length,
        });
      }

      const selectedAttributes = filterAttributes.reduce(
        (acc: RubricFilterAttribute[], attribute) => {
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

      const selectedPrices: RubricFilterSelectedPrices | null =
        minPrice && maxPrice
          ? {
              id: `${rubric.slug}-selectedPrices`,
              clearSlug: `/${alwaysArray(catalogueFilter).join('/')}`,
              formattedMinPrice: getCurrencyString({ lang, value: minPrice }),
              formattedMaxPrice: getCurrencyString({ lang, value: maxPrice }),
            }
          : null;

      return {
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
          id: rubric.id,
          attributes: filterAttributes,
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
