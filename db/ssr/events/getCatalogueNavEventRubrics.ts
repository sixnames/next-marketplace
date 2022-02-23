import { castEventRubricForUI } from 'db/cast/castRubricForUI';
import { COL_OPTIONS } from 'db/collectionNames';
import { AttributeModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  CatalogueGroupedNavConfigItemInterface,
  CatalogueGroupedNavConfigsInterface,
  CatalogueNavConfigsInterface,
} from 'db/ssr/catalogue/getCatalogueNavRubrics';
import { EventRubricInterface } from 'db/uiInterfaces';
import { FILTER_SEPARATOR, SORT_DESC } from 'lib/config/common';

interface GetCatalogueNavEventRubricsInterface {
  citySlug?: string;
  companySlug?: string;
  stickyNavVisibleAttributesCount: number;
  stickyNavVisibleOptionsCount: number;
  locale: string;
  visibleEventRubricSlugs: string[];
}

export async function getCatalogueNavEventRubrics({
  citySlug,
  companySlug,
  locale,
  stickyNavVisibleAttributesCount,
  stickyNavVisibleOptionsCount,
  visibleEventRubricSlugs,
}: GetCatalogueNavEventRubricsInterface): Promise<EventRubricInterface[]> {
  const collections = await getDbCollections();
  const eventFacetsCollection = collections.eventFacetsCollection();
  const eventRubricsCollection = collections.eventRubricsCollection();
  const attributesCollection = collections.attributesCollection();

  if (visibleEventRubricSlugs.length < 1) {
    return [];
  }

  const companyMatch = companySlug ? { companySlug } : {};
  const sortStage = {
    [`views.${companySlug}.${citySlug}`]: SORT_DESC,
    _id: SORT_DESC,
  };
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

  const catalogueNavConfigAggregation = await eventFacetsCollection
    .aggregate<CatalogueNavConfigsInterface>([
      {
        $match: {
          citySlug,
          ...companyMatch,
          rubricSlug: {
            $in: visibleEventRubricSlugs,
          },
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
  const initialRubricsAggregation = await eventRubricsCollection
    .aggregate<EventRubricInterface>([
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
    ])
    .toArray();

  const rubrics: EventRubricInterface[] = [];

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

      const castedEventRubric = castEventRubricForUI({
        locale: locale,
        rubric: {
          ...rubric,
          attributes: rubricAttributesAggregation,
        },
      });
      rubrics.push(castedEventRubric);
    }
  }

  return rubrics;
}
