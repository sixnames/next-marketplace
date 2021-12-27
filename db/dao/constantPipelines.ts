import {
  DEFAULT_SORT_STAGE,
  FILTER_SEPARATOR,
  IMAGE_FALLBACK,
  IMAGE_FALLBACK_BOTTLE,
  SORT_DESC,
} from '../../config/common';
import {
  COL_BRANDS,
  COL_BRAND_COLLECTIONS,
  COL_RUBRICS,
  COL_ATTRIBUTES_GROUPS,
  COL_OPTIONS,
  COL_SUPPLIERS,
  COL_SUPPLIER_PRODUCTS,
  COL_ATTRIBUTES,
  COL_CATEGORIES,
  COL_PRODUCT_SUMMARIES,
  COL_ICONS,
  COL_RUBRIC_VARIANTS,
} from '../collectionNames';

export const ignoreNoImageStage = {
  $and: [
    {
      mainImage: {
        $ne: IMAGE_FALLBACK,
      },
    },
    {
      mainImage: {
        $ne: IMAGE_FALLBACK_BOTTLE,
      },
    },
  ],
};

export const noImageStage = {
  mainImage: {
    $in: [IMAGE_FALLBACK, IMAGE_FALLBACK_BOTTLE],
  },
};

interface ProductAttributesPipelineInterface {
  getOptionIcon?: boolean;
}

export const productAttributesPipeline = (props?: ProductAttributesPipelineInterface) => {
  const getOptionIcon = props?.getOptionIcon;

  const optionIconPipeline = getOptionIcon
    ? [
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
                  collectionName: COL_OPTIONS,
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
      ]
    : [];

  return [
    {
      $unwind: '$attributes',
    },
    {
      $lookup: {
        from: COL_ATTRIBUTES,
        localField: 'attributes.attributeId',
        foreignField: '_id',
        as: 'attributes.attribute',
      },
    },
    {
      $addFields: {
        'attributes.attribute': {
          $arrayElemAt: ['$attributes.attribute', 0],
        },
      },
    },
    {
      $match: {
        'attributes.attribute': {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: COL_OPTIONS,
        as: 'attributes.attribute.options',
        let: {
          optionIds: '$attributes.optionIds',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $in: ['$_id', '$$optionIds'],
                  },
                ],
              },
            },
          },
          ...optionIconPipeline,
        ],
      },
    },
    {
      $group: {
        _id: '$_id',
        attributes: {
          $push: '$attributes',
        },
        doc: {
          $first: '$$ROOT',
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$doc', { attributes: '$attributes' }],
        },
      },
    },
  ];
};

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
              $eq: ['$$slug', '$itemId'],
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
                        $eq: ['$itemId', '$$brandCollectionSlug'],
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

export const productCategoriesPipeline = (additionalStages: Record<any, any>[] = []) => {
  return [
    {
      $lookup: {
        from: COL_CATEGORIES,
        as: 'categories',
        let: {
          rubricId: '$rubricId',
          categorySlugs: '$categorySlugs',
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
                    $in: ['$slug', '$$categorySlugs'],
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

export const shopProductSupplierProductsPipeline = [
  {
    $lookup: {
      from: COL_SUPPLIER_PRODUCTS,
      as: 'supplierProducts',
      let: {
        shopProductId: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$shopProductId', '$$shopProductId'],
            },
          },
        },

        // get supplier
        {
          $lookup: {
            from: COL_SUPPLIERS,
            as: 'supplier',
            let: {
              supplierId: '$supplierId',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$supplierId'],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            supplier: {
              $arrayElemAt: ['$supplier', 0],
            },
          },
        },
      ],
    },
  },
];

export const summaryPipeline = (idFieldName: string) => {
  return [
    {
      $lookup: {
        from: COL_PRODUCT_SUMMARIES,
        as: 'summary',
        let: {
          productId: idFieldName,
          shopProductIds: '$shopProductIds',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$productId', '$_id'],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        summary: { $arrayElemAt: ['$summary', 0] },
      },
    },
  ];
};

export const paginatedAggregationFinalPipeline = (limit: number) => {
  return [
    {
      $addFields: {
        totalDocsObject: { $arrayElemAt: ['$countAllDocs', 0] },
      },
    },
    {
      $addFields: {
        countAllDocs: null,
        totalDocsObject: null,
        totalDocs: '$totalDocsObject.totalDocs',
      },
    },
    {
      $addFields: {
        totalPagesFloat: {
          $divide: ['$totalDocs', limit],
        },
      },
    },
    {
      $addFields: {
        totalPages: {
          $ceil: '$totalPagesFloat',
        },
      },
    },
  ];
};

interface ShopProductDocsFacetPipelineInterface {
  skip: number;
  limit: number;
  sortStage: Record<any, any>;
  getSuppliers?: boolean;
}

export function shopProductDocsFacetPipeline({
  limit,
  skip,
  sortStage,
  getSuppliers,
}: ShopProductDocsFacetPipelineInterface) {
  const suppliersPipeline = getSuppliers ? shopProductSupplierProductsPipeline : [];
  return [
    {
      $sort: {
        sortIndex: SORT_DESC,
        ...sortStage,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },

    // get shop product fields
    ...summaryPipeline('$_id'),

    // get supplier products
    ...suppliersPipeline,
  ];
}

export interface ProductsPaginatedAggregationInterface {
  companySlug: string;
  citySlug: string;
}

export function shopProductsGroupPipeline({
  citySlug,
  companySlug,
}: ProductsPaginatedAggregationInterface) {
  return [
    // group shop products by productId field
    {
      $group: {
        _id: '$productId',
        companyId: { $first: `$companyId` },
        itemId: { $first: '$itemId' },
        rubricId: { $first: '$rubricId' },
        rubricSlug: { $first: `$rubricSlug` },
        brandSlug: { $first: '$brandSlug' },
        mainImage: { $first: '$mainImage' },
        brandCollectionSlug: { $first: '$brandCollectionSlug' },
        views: { $max: `$views.${companySlug}.${citySlug}` },
        minPrice: {
          $min: '$price',
        },
        maxPrice: {
          $min: '$price',
        },
        available: {
          $max: '$available',
        },
        filterSlugs: {
          $first: '$filterSlugs',
        },
        shopsIds: {
          $addToSet: '$shopId',
        },
        shopProductsIds: {
          $addToSet: '$_id',
        },
      },
    },
    {
      $addFields: {
        sortIndex: {
          $cond: {
            if: {
              $gt: ['$available', 0],
            },
            then: 1,
            else: 0,
          },
        },
      },
    },
  ];
}

export function productsPaginatedAggregationFacetsPipeline({
  companySlug,
  citySlug,
}: ProductsPaginatedAggregationInterface) {
  const sortPipeline = [
    {
      $addFields: {
        views: { $max: `$views.${companySlug}.${citySlug}` },
      },
    },
    {
      $sort: DEFAULT_SORT_STAGE,
    },
  ];

  return {
    // prices facet
    prices: [
      {
        $group: {
          _id: '$minPrice',
        },
      },
    ],

    // categories facet
    categories: [
      {
        $unwind: {
          path: '$categorySlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          rubricId: { $first: '$rubricId' },
          categorySlugs: {
            $addToSet: '$categorySlugs',
          },
        },
      },
      {
        $lookup: {
          from: COL_CATEGORIES,
          as: 'categories',
          let: {
            rubricId: '$rubricId',
            categorySlugs: '$categorySlugs',
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
                      $in: ['$slug', '$$categorySlugs'],
                    },
                  },
                ],
              },
            },
            ...sortPipeline,

            // get category icon
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
          ],
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
    ],

    // brands facet
    brands: [
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
            itemId: '$_id',
            collectionSlugs: '$collectionSlugs',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$itemId', '$$itemId'],
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
                            $in: ['$itemId', '$$collectionSlugs'],
                          },
                        },
                      ],
                    },
                  },
                  ...sortPipeline,
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
      ...sortPipeline,
    ],

    // rubric facet
    rubrics: [
      {
        $group: {
          _id: '$rubricId',
        },
      },
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubric',
          let: {
            rubricId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$rubricId'],
                },
              },
            },
            {
              $project: {
                views: false,
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
    ],

    // attributes facet
    attributes: [
      {
        $unwind: {
          path: '$filterSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          filterSlugs: {
            $addToSet: '$filterSlugs',
          },
        },
      },
      {
        $unwind: {
          path: '$filterSlugs',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          filterSlugs: {
            $exists: true,
          },
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
                  ...sortPipeline,
                ],
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
      ...sortPipeline,
    ],

    // countAllDocs facet
    countAllDocs: [
      {
        $count: 'totalDocs',
      },
    ],
  };
}
