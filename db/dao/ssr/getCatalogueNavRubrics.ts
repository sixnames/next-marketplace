import { ObjectId } from 'mongodb';
import { DEFAULT_COMPANY_SLUG, FILTER_SEPARATOR, SORT_DESC } from '../../../config/common';
import { getTreeFromList } from '../../../lib/treeUtils';
import {
  COL_ATTRIBUTES,
  COL_CATALOGUE_NAV,
  COL_CATEGORIES,
  COL_ICONS,
  COL_OPTIONS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from '../../collectionNames';
import {
  AttributeModel,
  CatalogueNavModel,
  CategoryModel,
  ObjectIdModel,
  ShopProductModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { RubricInterface } from '../../uiInterfaces';
import { ignoreNoImageStage } from '../constantPipelines';
import { castRubricForUI } from '../rubrics/castRubricForUI';

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
  attributeConfigs: CatalogueNavConfigItemInterface[];
}

interface CatalogueNavCategoriesConfigInterface {
  rubricId: ObjectIdModel;
  categoryIds: ObjectIdModel[];
}

interface GetCatalogueNavRubricsInterface {
  citySlug: string;
  companySlug: string;
  stickyNavVisibleCategoriesCount: number;
  stickyNavVisibleAttributesCount: number;
  stickyNavVisibleOptionsCount: number;
  visibleCategoriesInNavDropdown: string[];
  locale: string;
}

export const createCatalogueNavRubrics = async ({
  citySlug,
  companySlug,
  stickyNavVisibleCategoriesCount,
  stickyNavVisibleAttributesCount,
  stickyNavVisibleOptionsCount,
  visibleCategoriesInNavDropdown,
}: GetCatalogueNavRubricsInterface): Promise<RubricInterface[]> => {
  // console.log(' ');
  // console.log('=================== createCatalogueNavRubrics =======================');
  // const timeStart = new Date().getTime();
  const { db } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const rubricsCollection = db.collection<RubricInterface>(COL_RUBRICS);
  const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

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
  // console.log('categoryConfigs', new Date().getTime() - timeStart);

  // common pipeline stages
  const sortStage = {
    [`views.${companySlug}.${citySlug}`]: SORT_DESC,
    _id: SORT_DESC,
  };
  const companyMatch = companySlug !== DEFAULT_COMPANY_SLUG ? { companySlug } : {};
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
    .aggregate<CatalogueNavConfigsInterface>([
      {
        $match: {
          ...companyMatch,
          citySlug,
          ...ignoreNoImageStage,
        },
      },
      {
        $project: {
          _id: true,
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
          _id: '$rubricId',
          attributeConfigs: {
            $addToSet: {
              attributeSlug: '$attributeSlug',
              optionSlug: '$optionSlug',
            },
          },
        },
      },
    ])
    .toArray();
  // console.log('catalogueNavConfigAggregation', new Date().getTime() - timeStart);

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
  // console.log('catalogueGroupedNavConfigs', new Date().getTime() - timeStart);

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
  // console.log('initialRubricsAggregation', new Date().getTime() - timeStart);

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
                optionSlugs: '$config.optionSlugs',
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
                          $in: ['$slug', '$$optionSlugs'],
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
                                $in: ['$slug', '$$optionSlugs'],
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
      // console.log('rubricAttributesAggregation', new Date().getTime() - timeStart);

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
      // console.log('categories', new Date().getTime() - timeStart);

      const categoriesTree = getTreeFromList({
        list: categories,
        childrenFieldName: 'categories',
      });
      // console.log('categoriesTree', new Date().getTime() - timeStart);

      rubrics.push({
        ...rubric,
        categories: categoriesTree.slice(0, stickyNavVisibleCategoriesCount),
        attributes: rubricAttributesAggregation,
      });
    }
  }
  // console.log('All rubrics >>>>>>>>>>>>>>>> ', new Date().getTime() - timeStart);

  return rubrics;
};

export const updateCatalogueNavRubrics = async ({
  citySlug,
  locale,
  companySlug,
  ...props
}: GetCatalogueNavRubricsInterface): Promise<CatalogueNavModel> => {
  // console.log(' ');
  // console.log('=================== updateCatalogueNavRubrics =======================');
  // const timeStart = new Date().getTime();
  const { db } = await getDatabase();
  const catalogueNavCollection = db.collection<CatalogueNavModel>(COL_CATALOGUE_NAV);
  const newCatalogueNavRubrics = await createCatalogueNavRubrics({
    citySlug,
    locale,
    companySlug,
    ...props,
  });
  const newCatalogueNav: CatalogueNavModel = {
    _id: new ObjectId(),
    companySlug,
    citySlug,
    rubrics: newCatalogueNavRubrics,
    createdAt: new Date(),
  };

  await catalogueNavCollection.findOneAndUpdate(
    {
      companySlug,
      citySlug,
    },
    {
      $set: {
        companySlug,
        citySlug,
        rubrics: newCatalogueNav.rubrics,
        createdAt: newCatalogueNav.createdAt,
      },
    },
    {
      upsert: true,
    },
  );
  return newCatalogueNav;
};

export const getCatalogueNavRubrics = async ({
  citySlug,
  locale,
  companySlug,
  ...props
}: GetCatalogueNavRubricsInterface): Promise<RubricInterface[]> => {
  // console.log(' ');
  // console.log('=================== getCatalogueNavRubrics =======================');
  // const timeStart = new Date().getTime();
  const { db } = await getDatabase();
  const catalogueNavCollection = db.collection<CatalogueNavModel>(COL_CATALOGUE_NAV);
  let catalogueNav = await catalogueNavCollection.findOne({
    companySlug,
    citySlug,
  });

  if (!catalogueNav) {
    const newCatalogueNav = await updateCatalogueNavRubrics({
      citySlug,
      locale,
      companySlug,
      ...props,
    });
    catalogueNav = newCatalogueNav;
  }

  const payload: RubricInterface[] = catalogueNav.rubrics.map((rubric) => {
    return castRubricForUI({
      rubric,
      locale,
      noSort: true,
    });
  });
  // console.log('categoryConfigs', new Date().getTime() - timeStart);

  return payload;
};
