import {
  FILTER_SEPARATOR,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_CITY,
  SORT_DESC,
  CMS_FILTER_BRANDS_LIMIT,
} from 'config/common';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_CATEGORIES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_PRODUCT_CONNECTIONS,
  COL_PRODUCTS,
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
      ? {}
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
          $split: ['$selectedOptionsSlugs', FILTER_SEPARATOR],
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
              from: COL_ATTRIBUTES,
              as: 'attributes',
              let: {
                attributesGroupIds: '$attributesGroupIds',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $in: ['$attributesGroupId', '$$attributesGroupIds'],
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

export const productAttributesPipeline = [
  {
    $lookup: {
      from: COL_PRODUCT_ATTRIBUTES,
      as: 'attributes',
      let: {
        productId: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$$productId', '$productId'],
            },
          },
        },
        {
          $lookup: {
            from: COL_OPTIONS,
            as: 'options',
            let: {
              optionsGroupId: '$optionsGroupId',
              selectedOptionsIds: '$selectedOptionsIds',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$optionsGroupId', '$$optionsGroupId'],
                      },
                      {
                        $in: ['$_id', '$$selectedOptionsIds'],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
];

export const shopProductAttributesPipeline = [
  {
    $lookup: {
      from: COL_PRODUCT_ATTRIBUTES,
      as: 'attributes',
      let: {
        productId: '$productId',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$$productId', '$productId'],
            },
          },
        },
        {
          $lookup: {
            from: COL_OPTIONS,
            as: 'options',
            let: {
              optionsGroupId: '$optionsGroupId',
              selectedOptionsIds: '$selectedOptionsIds',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$optionsGroupId', '$$optionsGroupId'],
                      },
                      {
                        $in: ['$_id', '$$selectedOptionsIds'],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
];

export const brandPipeline = [
  {
    $lookup: {
      from: COL_BRANDS,
      as: 'brand',
      let: {
        slug: '$brandSlug',
        brandCollectionSlug: '$brandCollectionSlug',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$$slug', '$slug'],
            },
          },
        },
        {
          $lookup: {
            from: COL_BRAND_COLLECTIONS,
            as: 'collections',
            let: {
              brandId: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      $expr: {
                        $eq: ['$brandId', '$$brandId'],
                      },
                    },
                    {
                      $expr: {
                        $eq: ['$slug', '$$brandCollectionSlug'],
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  descriptionI18n: false,
                },
              },
            ],
          },
        },
        {
          $project: {
            url: false,
            descriptionI18n: false,
            logo: false,
          },
        },
      ],
    },
  },
  {
    $addFields: {
      brand: {
        $arrayElemAt: ['$brand', 0],
      },
    },
  },
];

interface FilterBrandsPipelineInterface {
  additionalStage?: any[];
}

export const filterBrandsPipeline = ({ additionalStage }: FilterBrandsPipelineInterface) => {
  const finalAdditionalStage = additionalStage || [];

  return [
    {
      $group: {
        _id: '$brandSlug',
        collectionSlugs: {
          $addToSet: '$brandCollectionSlug',
        },
      },
    },
    {
      $lookup: {
        from: COL_BRANDS,
        as: 'brand',
        let: {
          slug: '$_id',
          collectionSlugs: '$collectionSlugs',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$slug', '$$slug'],
              },
            },
          },
          {
            $lookup: {
              from: COL_BRAND_COLLECTIONS,
              as: 'collections',
              let: {
                brandId: '$_id',
              },
              pipeline: [
                {
                  $match: {
                    $and: [
                      {
                        $expr: {
                          $eq: ['$brandId', '$$brandId'],
                        },
                      },
                      {
                        $expr: {
                          $in: ['$slug', '$$collectionSlugs'],
                        },
                      },
                    ],
                  },
                },
                ...finalAdditionalStage,
              ],
            },
          },
        ],
      },
    },
    {
      $addFields: {
        brand: {
          $arrayElemAt: ['$brand', 0],
        },
      },
    },
    {
      $match: {
        brand: {
          $exists: true,
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$brand',
      },
    },
    ...finalAdditionalStage,
  ];
};

export const filterCmsBrandsPipeline = filterBrandsPipeline({
  additionalStage: [
    {
      $sort: {
        _id: SORT_DESC,
      },
    },
    {
      $limit: CMS_FILTER_BRANDS_LIMIT,
    },
  ],
});

export const productCategoriesPipeline = (additionalStages: Record<any, any>[] = []) => {
  return [
    {
      $lookup: {
        from: COL_CATEGORIES,
        as: 'categories',
        let: {
          rubricId: '$rubricId',
          selectedOptionsSlugs: '$selectedOptionsSlugs',
        },
        pipeline: [
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $eq: ['$rubricId', '$$rubricId'],
                  },
                },
                {
                  $expr: {
                    $in: ['$slug', '$$selectedOptionsSlugs'],
                  },
                },
              ],
            },
          },
          ...additionalStages,
        ],
      },
    },
  ];
};

export const filterCmsCategoriesPipeline = [
  {
    $unwind: {
      path: '$selectedOptionsSlugs',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $group: {
      _id: null,
      rubricId: { $first: '$rubricId' },
      selectedOptionsSlugs: {
        $addToSet: '$selectedOptionsSlugs',
      },
    },
  },
  ...productCategoriesPipeline(),
  {
    $sort: {
      _id: SORT_DESC,
    },
  },
  {
    $unwind: {
      path: '$categories',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $match: {
      categories: {
        $exists: true,
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: '$categories',
    },
  },
];

export const filterAttributesPipeline = (sortStage: Record<any, any>) => {
  return [
    {
      $unwind: {
        path: '$selectedOptionsSlugs',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: null,
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
      $match: {
        selectedOptionsSlugs: {
          $exists: true,
        },
      },
    },
    {
      $addFields: {
        slugArray: {
          $split: ['$selectedOptionsSlugs', FILTER_SEPARATOR],
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
        optionSlugs: {
          $addToSet: '$optionSlug',
        },
      },
    },

    // get attributes
    {
      $lookup: {
        from: COL_ATTRIBUTES,
        as: 'attribute',
        let: {
          attributeSlug: '$_id',
          optionSlugs: '$optionSlugs',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$slug', '$$attributeSlug'],
                  },
                ],
              },
            },
          },
          {
            $sort: sortStage,
          },
          // get attribute options
          {
            $lookup: {
              from: COL_OPTIONS,
              as: 'options',
              let: {
                optionsGroupId: '$optionsGroupId',
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
            },
          },
        ],
      },
    },
    {
      $addFields: {
        attribute: {
          $arrayElemAt: ['$attribute', 0],
        },
      },
    },
    {
      $match: {
        attribute: {
          $exists: true,
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$attribute',
      },
    },
  ];
};

export const productRubricPipeline = [
  {
    $lookup: {
      from: COL_RUBRICS,
      as: 'rubric',
      let: {
        rubricId: '$rubricId',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$rubricId'],
            },
          },
        },
      ],
    },
  },
  {
    $addFields: {
      rubric: {
        $arrayElemAt: ['$rubric', 0],
      },
    },
  },
];

export const productConnectionsSimplePipeline = [
  {
    $lookup: {
      from: COL_PRODUCT_CONNECTIONS,
      as: 'connections',
      let: { productId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$$productId', '$productsIds'],
            },
          },
        },
        {
          $lookup: {
            from: COL_ATTRIBUTES,
            as: 'attribute',
            let: { attributeId: '$attributeId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$attributeId', '$_id'],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            attribute: {
              $arrayElemAt: ['$attribute', 0],
            },
          },
        },
        {
          $lookup: {
            from: COL_PRODUCT_CONNECTION_ITEMS,
            as: 'connectionProducts',
            let: { connectionId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$connectionId', '$connectionId'],
                  },
                },
              },
              {
                $sort: {
                  _id: SORT_DESC,
                },
              },
              {
                $lookup: {
                  from: COL_OPTIONS,
                  as: 'option',
                  let: { optionId: '$optionId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$optionId', '$_id'],
                        },
                      },
                    },
                  ],
                },
              },
              {
                $lookup: {
                  from: COL_PRODUCTS,
                  as: 'product',
                  let: { productId: '$productId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$productId', '$_id'],
                        },
                      },
                    },

                    // Lookup product attributes
                    ...productAttributesPipeline,

                    // Lookup product brand
                    ...brandPipeline,

                    // Lookup product categories
                    ...productCategoriesPipeline(),
                  ],
                },
              },
              {
                $addFields: {
                  product: {
                    $arrayElemAt: ['$product', 0],
                  },
                  option: {
                    $arrayElemAt: ['$option', 0],
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
];

export const rubricAttributesGroupAttributesPipeline = [
  {
    $lookup: {
      from: COL_ATTRIBUTES,
      as: 'attributes',
      let: {
        attributesGroupId: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$attributesGroupId', '$$attributesGroupId'],
            },
          },
        },
        {
          $sort: {
            _id: SORT_DESC,
          },
        },
      ],
    },
  },
];

export const rubricAttributeGroupsPipeline = [
  {
    $lookup: {
      from: COL_ATTRIBUTES_GROUPS,
      as: 'attributesGroups',
      let: {
        attributesGroupIds: '$attributesGroupIds',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$_id', '$$attributesGroupIds'],
            },
          },
        },
        {
          $sort: {
            _id: SORT_DESC,
          },
        },

        // get attributes
        ...rubricAttributesGroupAttributesPipeline,
      ],
    },
  },
];

export const shopProductFieldsPipeline = (idFieldName: string) => {
  return [
    {
      $lookup: {
        from: COL_PRODUCTS,
        as: 'product',
        let: {
          productId: idFieldName,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$productId', '$_id'],
              },
            },
          },

          // get product attributes
          ...productAttributesPipeline,

          // get product brand
          ...brandPipeline,

          // get product categories
          ...productCategoriesPipeline(),

          // get product connections
          {
            $lookup: {
              from: COL_PRODUCT_CONNECTIONS,
              as: 'connections',
              let: {
                productId: '$_id',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ['$$productId', '$productsIds'],
                    },
                  },
                },
                {
                  $lookup: {
                    from: COL_ATTRIBUTES,
                    as: 'attribute',
                    let: { attributeId: '$attributeId' },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ['$$attributeId', '$_id'],
                          },
                        },
                      },
                    ],
                  },
                },
                {
                  $addFields: {
                    attribute: {
                      $arrayElemAt: ['$attribute', 0],
                    },
                  },
                },
                {
                  $lookup: {
                    from: COL_PRODUCT_CONNECTION_ITEMS,
                    as: 'connectionProducts',
                    let: {
                      connectionId: '$_id',
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ['$connectionId', '$$connectionId'],
                          },
                        },
                      },
                      {
                        $lookup: {
                          from: COL_OPTIONS,
                          as: 'option',
                          let: { optionId: '$optionId' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $eq: ['$$optionId', '$_id'],
                                },
                              },
                            },
                          ],
                        },
                      },
                      {
                        $addFields: {
                          option: {
                            $arrayElemAt: ['$option', 0],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          // get product rubric
          {
            $lookup: {
              from: COL_RUBRICS,
              as: 'rubric',
              let: {
                rubricId: '$rubricId',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$$rubricId', '$_id'],
                    },
                  },
                },
                {
                  $project: {
                    _id: true,
                    slug: true,
                    nameI18n: true,
                    showRubricNameInProductTitle: true,
                    showCategoryInProductTitle: true,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              rubric: { $arrayElemAt: ['$rubric', 0] },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        product: { $arrayElemAt: ['$product', 0] },
      },
    },
  ];
};
