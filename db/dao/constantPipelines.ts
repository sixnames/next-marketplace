import {
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

export const productAttributesPipeline = [
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
    from: COL_OPTIONS,
    localField: 'attributes.selectedOptionsIds',
    foreignField: '_id',
    as: 'attributes.attribute.options',
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
          filterSlugs: '$filterSlugs',
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

export const filterAttributesPipeline = (sortStage: Record<any, any>) => {
  return [
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
                {
                  $sort: sortStage,
                },
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
    {
      $sort: sortStage,
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

export const shopProductFieldsPipeline = (idFieldName: string) => {
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
