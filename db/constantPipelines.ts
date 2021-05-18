import {
  CATALOGUE_OPTION_SEPARATOR,
  CONFIG_DEFAULT_COMPANY_SLUG,
  DEFAULT_CITY,
  SORT_DESC,
} from 'config/common';
import { COL_OPTIONS, COL_RUBRIC_ATTRIBUTES, COL_RUBRICS } from 'db/collectionNames';

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
    companySlug: CONFIG_DEFAULT_COMPANY_SLUG,
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
    ? [
        {
          $limit: visibleOptionsCount,
        },
      ]
    : [];

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
        _id: '$_id',
        attributesSlugs: {
          $addToSet: '$attributeSlug',
        },
        optionsSlugs: {
          $addToSet: '$optionSlug',
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
          optionsSlugs: '$optionsSlugs',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$rubricId'],
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
                  $project: {
                    variant: false,
                    viewVariant: false,
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
                    let: { optionsGroupId: '$optionsGroupId' },
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
                    ],
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
