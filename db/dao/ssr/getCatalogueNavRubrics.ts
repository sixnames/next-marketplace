import { ObjectId } from 'mongodb';
import { DEFAULT_COMPANY_SLUG, FILTER_SEPARATOR, SORT_DESC } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getTreeFromList } from '../../../lib/treeUtils';
import {
  COL_ATTRIBUTES,
  COL_CATEGORIES,
  COL_ICONS,
  COL_OPTIONS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../collectionNames';
import {
  AttributeModel,
  CategoryModel,
  ObjectIdModel,
  RubricModel,
  ShopProductModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { CompanyInterface, RubricInterface } from '../../uiInterfaces';
import { castAttributeForUI } from '../attributes/castAttributesGroupForUI';
import { ignoreNoImageStage } from '../constantPipelines';

export interface GetCatalogueNavRubricsInterface {
  locale: string;
  city: string;
  domainCompany?: CompanyInterface | null;
  stickyNavVisibleCategoriesCount: number;
  stickyNavVisibleAttributesCount: number;
  stickyNavVisibleOptionsCount: number;
  visibleCategoriesInNavDropdown: string[];
}

interface CatalogueGroupedNavConfigItemInterface {
  attributeSlug: string;
  optionSlugs: string[];
}

interface CatalogueGroupedNavConfigsInterface {
  _id: ObjectIdModel;
  attributeSlugs: string[];
  attributeConfigs: CatalogueGroupedNavConfigItemInterface[];
}

interface CatalogueNavConfigItemInterface {
  attributeSlug: string;
  optionSlug: string;
}

interface CatalogueNavConfigsInterface {
  _id: ObjectIdModel;
  categorySlugs: string[];
  attributeConfigs: CatalogueNavConfigItemInterface[];
}

interface CatalogueNavCategoriesConfigInterface {
  rubricId: ObjectIdModel;
  categoryIds: ObjectIdModel[];
}

export const getCatalogueNavRubrics = async ({
  city,
  locale,
  domainCompany,
  stickyNavVisibleCategoriesCount,
  stickyNavVisibleAttributesCount,
  stickyNavVisibleOptionsCount,
  visibleCategoriesInNavDropdown,
}: GetCatalogueNavRubricsInterface): Promise<RubricModel[]> => {
  // console.log(' ');
  // console.log('=================== getCatalogueNavRubrics =======================');
  // const timeStart = new Date().getTime();
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const companySlug = domainCompany?.slug || DEFAULT_COMPANY_SLUG;

  // console.log('Before rubrics', new Date().getTime() - timeStart);

  // get nav rubric categories config
  let categoryConfigs: CatalogueNavCategoriesConfigInterface[] = [];
  visibleCategoriesInNavDropdown.forEach((configString) => {
    const configParts = configString.split(FILTER_SEPARATOR);
    const rubricId = configParts[0] ? new ObjectId(`${configParts[0]}`) : null;
    const categoryId = configParts[1] ? new ObjectId(`${configParts[1]}`) : null;
    if (rubricId && categoryId) {
      const existingIndex = categoryConfigs.findIndex((config) => {
        return config.rubricId.equals(rubricId);
      });
      if (existingIndex > -1) {
        categoryConfigs[existingIndex].categoryIds.push(categoryId);
      } else {
        categoryConfigs.push({
          rubricId,
          categoryIds: [categoryId],
        });
      }
    }
  });

  // common pipeline stages
  const sortStage = {
    [`views.${companySlug}.${city}`]: SORT_DESC,
    _id: SORT_DESC,
  };
  const companyMatch = domainCompany ? { companyId: new ObjectId(domainCompany._id) } : {};
  const attributesLimit = stickyNavVisibleAttributesCount
    ? [
        {
          $limit: stickyNavVisibleAttributesCount,
        },
      ]
    : [];
  const optionsLimit = stickyNavVisibleOptionsCount
    ? [
        {
          $limit: stickyNavVisibleOptionsCount,
        },
      ]
    : [];

  const catalogueNavConfigAggregation = await shopProductsCollection
    .aggregate<ShopProductModel>([
      {
        $match: {
          ...companyMatch,
          citySlug: city,
          ...ignoreNoImageStage,
        },
      },
      {
        $project: {
          _id: true,
          categorySlugs: true,
          filterSlugs: true,
          rubricId: true,
        },
      },
      {
        $unwind: {
          path: '$filterSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$categorySlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$rubricId',
          filterSlugs: {
            $addToSet: '$filterSlugs',
          },
          categorySlugs: {
            $addToSet: '$categorySlugs',
          },
        },
      },
      /*{
        $unwind: {
          path: '$filterSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          slugArray: {
            $split: ['$filterSlugs', FILTER_SEPARATOR],
          },
        },
      },
      {
        $addFields: {
          attributeSlug: {
            $arrayElemAt: ['$slugArray', 0],
          },
          optionSlug: {
            $arrayElemAt: ['$slugArray', 1],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          attributesSlugs: {
            $addToSet: '$attributeSlug',
          },
          attributeConfigs: {
            $push: {
              attributeSlug: '$attributeSlug',
              optionSlug: '$optionSlug',
            },
          },
        },
      },*/
    ])
    .toArray();

  const catalogueGroupedNavConfigs: CatalogueGroupedNavConfigsInterface[] =
    catalogueNavConfigAggregation.map((rubricConfig) => {
      return {
        _id: rubricConfig._id,
        attributeSlugs: rubricConfig.attributeConfigs.map(({ attributeSlug }) => attributeSlug),
        attributeConfigs: rubricConfig.attributeConfigs.reduce(
          (acc: CatalogueGroupedNavConfigItemInterface[], config) => {
            const existingConfigIndex = acc.findIndex(({ attributeSlug }) => {
              return attributeSlug === config.attributeSlug;
            });
            if (existingConfigIndex > -1) {
              acc[existingConfigIndex] = {
                attributeSlug: config.attributeSlug,
                optionSlugs: [...acc[existingConfigIndex].optionSlugs, config.optionSlug],
              };
              return acc;
            }

            return [
              ...acc,
              {
                attributeSlug: config.attributeSlug,
                optionSlugs: [config.optionSlug],
              },
            ];
          },
          [],
        ),
      };
    });

  const rubricsIds = catalogueGroupedNavConfigs.map(({ _id }) => _id);
  const initialRubricsAggregation = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          _id: {
            $in: rubricsIds,
          },
        },
      },
      {
        $sort: sortStage,
      },
      // Lookup rubric variant
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

  const rubrics: RubricInterface[] = [];
  for await (const rubric of initialRubricsAggregation) {
    const rubricConfig = catalogueGroupedNavConfigs.find((config) => {
      return rubric._id.equals(config._id);
    });

    if (rubricConfig) {
      const rubricAttributesAggregation = await attributesCollection
        .aggregate<AttributeModel>([
          {
            $match: {
              showInCatalogueNav: true,
              slug: {
                $in: rubricConfig.attributeSlugs,
              },
            },
          },
          {
            $sort: sortStage,
          },
          ...attributesLimit,
          {
            $project: {
              capitalise: false,
              variant: false,
              viewVariant: false,
              positioningInTitle: false,
              positioningInCardTitle: false,
              showAsBreadcrumb: false,
              showAsCatalogueBreadcrumb: false,
              notShowAsAlphabet: false,
              showInSnippet: false,
              showInCard: false,
              showInCatalogueFilter: false,
              showInCatalogueNav: false,
              showInCatalogueTitle: false,
              showInCardTitle: false,
              showInSnippetTitle: false,
              showNameInTitle: false,
              showNameInSelectedAttributes: false,
              showNameInCardTitle: false,
              showNameInSnippetTitle: false,
            },
          },
          {
            $addFields: {
              config: rubricConfig.attributeConfigs,
            },
          },
          {
            $addFields: {
              config: {
                $filter: {
                  input: '$config',
                  as: 'config',
                  cond: {
                    $eq: ['$$config.attributeSlug', '$slug'],
                  },
                },
              },
            },
          },
          {
            $addFields: {
              config: {
                $arrayElemAt: ['$config', 0],
              },
            },
          },
          {
            $match: {
              config: {
                $exists: true,
              },
            },
          },
          // Lookup rubric attribute options
          {
            $lookup: {
              from: COL_OPTIONS,
              as: 'options',
              let: {
                optionsGroupId: '$optionsGroupId',
                optionsSlugs: '$config.optionSlugs',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$optionsGroupId', '$optionsGroupId'],
                        },
                        {
                          $in: ['$slug', '$$optionsSlugs'],
                        },
                      ],
                    },
                    $or: [
                      {
                        parentId: {
                          $exists: false,
                        },
                      },
                      {
                        parentId: null,
                      },
                    ],
                  },
                },
                {
                  $sort: sortStage,
                },
                ...optionsLimit,

                // Lookup nested options
                {
                  $lookup: {
                    from: COL_OPTIONS,
                    as: 'options',
                    let: {
                      parentId: '$_id',
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              {
                                $eq: ['$$optionsGroupId', '$optionsGroupId'],
                              },
                              {
                                $in: ['$slug', '$$optionsSlugs'],
                              },
                              {
                                $eq: ['$parentId', '$$parentId'],
                              },
                            ],
                          },
                        },
                      },
                      {
                        $sort: sortStage,
                      },
                      ...optionsLimit,
                    ],
                  },
                },
              ],
            },
          },
        ])
        .toArray();

      let categories: CategoryModel[] = [];
      if (rubric.variant?.showCategoriesInNav) {
        const rubricCategoriesConfig = categoryConfigs.find(({ rubricId }) => {
          return rubricId.equals(rubric._id);
        });

        if (rubricCategoriesConfig) {
          categories = await categoriesCollection
            .aggregate<CategoryModel>([
              {
                $match: {
                  _id: {
                    $in: rubricCategoriesConfig.categoryIds,
                  },
                  rubricId: rubric._id,
                  slug: {
                    $in: rubricConfig.attributeSlugs,
                  },
                },
              },
              {
                $lookup: {
                  from: COL_ICONS,
                  as: 'icon',
                  let: {
                    documentId: '$_id',
                  },
                  pipeline: [
                    {
                      $match: {
                        collectionName: COL_CATEGORIES,
                        $expr: {
                          $eq: ['$documentId', '$$documentId'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  icon: {
                    $arrayElemAt: ['$icon', 0],
                  },
                },
              },
            ])
            .toArray();
        }
      }

      const categoriesTree = getTreeFromList({
        list: categories,
        childrenFieldName: 'categories',
        locale,
      });

      rubrics.push({
        ...rubric,
        nameI18n: {},
        name: getFieldStringLocale(rubric.nameI18n, locale),
        categories: categoriesTree.slice(0, stickyNavVisibleCategoriesCount),
        attributes: rubricAttributesAggregation.map((attribute) => {
          return castAttributeForUI({
            attribute,
            locale,
          });
        }),
      });
    }
  }
  // console.log('Nav >>>>>>>>>>>>>>>> ', new Date().getTime() - timeStart);

  return rubrics;
};
