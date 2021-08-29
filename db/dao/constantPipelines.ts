import {
  CATALOGUE_OPTION_SEPARATOR,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_CITY,
  SORT_DESC,
} from 'config/common';
import {
  COL_OPTIONS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
} from 'db/collectionNames';

interface GetCatalogueRubricPipelineInterface {
  companySlug?: string;
  city?: string;
  visibleAttributesCount?: number | null;
  visibleOptionsCount?: number | null;
  viewVariant?: 'filter' | 'nav';
}
export function getCatalogueRubricPipeline(
  props?: GetCatalogueRubricPipelineInterface,
): Record<string, any>[] {
  const { companySlug, city, visibleAttributesCount, visibleOptionsCount, viewVariant } = props || {
    companySlug: DEFAULT_COMPANY_SLUG,
    city: DEFAULT_CITY,
    viewVariant: 'filter',
  };

  const sortStage = {
    [`priorities.${companySlug}.${city}`]: SORT_DESC,
    [`views.${companySlug}.${city}`]: SORT_DESC,
    _id: SORT_DESC,
  };

  const attributesLimit = visibleAttributesCount
    ? [
        {
          $limit: visibleAttributesCount,
        },
      ]
    : [];

  const optionsLimit = visibleOptionsCount
    ? {
        options: {
          $slice: ['$options', visibleOptionsCount],
        },
      }
    : {};

  const rubricAttributesViewVariant =
    viewVariant === 'filter'
      ? {
          showInCatalogueFilter: true,
        }
      : {
          showInCatalogueNav: true,
        };

  return [
    // Get attributes ond options slugs
    {
      $unwind: {
        path: '$selectedOptionsSlugs',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$rubricId',
        selectedOptionsSlugs: {
          $addToSet: '$selectedOptionsSlugs',
        },
      },
    },
    {
      $unwind: {
        path: '$selectedOptionsSlugs',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        slugArray: {
          $split: ['$selectedOptionsSlugs', CATALOGUE_OPTION_SEPARATOR],
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
        _id: '$attributeSlug',
        rubricId: {
          $first: '$_id',
        },
        optionsSlugs: {
          $addToSet: '$optionSlug',
        },
      },
    },
    {
      $group: {
        _id: '$rubricId',
        attributesSlugs: {
          $addToSet: '$_id',
        },
        attributeConfigs: {
          $push: {
            attributeSlug: '$_id',
            optionSlugs: '$optionsSlugs',
          },
        },
      },
    },

    // Lookup rubric
    {
      $lookup: {
        from: COL_RUBRICS,
        as: 'rubric',
        let: {
          rubricId: '$_id',
          attributesSlugs: '$attributesSlugs',
          attributeConfigs: '$attributeConfigs',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$rubricId'],
              },
            },
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

          // Lookup rubric attributes
          {
            $lookup: {
              from: COL_RUBRIC_ATTRIBUTES,
              as: 'attributes',
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$$rubricId', '$rubricId'],
                        },
                        {
                          $in: ['$slug', '$$attributesSlugs'],
                        },
                      ],
                    },
                    ...rubricAttributesViewVariant,
                  },
                },
                {
                  $sort: sortStage,
                },
                ...attributesLimit,
                {
                  $addFields: {
                    config: {
                      $filter: {
                        input: '$$attributeConfigs',
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
                  $project: {
                    rubricId: false,
                    showInCatalogueNav: false,
                    showInCatalogueFilter: false,
                    views: false,
                    priorities: false,
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
                    ],
                  },
                },

                {
                  $addFields: {
                    totalOptionsCount: {
                      $size: '$options',
                    },
                    ...optionsLimit,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $arrayElemAt: ['$rubric', 0],
        },
      },
    },
  ];
}
