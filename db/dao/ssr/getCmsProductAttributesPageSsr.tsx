import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext } from 'next';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_COMPANY_SLUG,
  SORT_DESC,
} from '../../../config/common';
import { sortObjectsByField } from '../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import { getCmsProduct } from '../../../lib/productUtils';
import { castDbData, getAppInitialData } from '../../../lib/ssrUtils';
import { CmsProductAttributesPageInterface } from '../../../pages/cms/rubrics/[rubricSlug]/products/product/[productId]/attributes';
import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS, COL_OPTIONS } from '../../collectionNames';
import { ObjectIdModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import {
  AttributesGroupInterface,
  OptionInterface,
  ProductAttributeInterface,
  ProductAttributesGroupInterface,
  ProductSummaryInterface,
} from '../../uiInterfaces';

export const getCmsProductAttributesPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<CmsProductAttributesPageInterface | null> => {
  const { query } = context;
  const { productId } = query;
  const { db } = await getDatabase();
  const attributesGroupsCollection = db.collection<AttributesGroupInterface>(COL_ATTRIBUTES_GROUPS);
  const optionsCollection = db.collection<OptionInterface>(COL_OPTIONS);
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return null;
  }

  const productPayload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  if (!productPayload) {
    return null;
  }

  const { product, categoriesList } = productPayload;
  const attributesGroupIds: ObjectIdModel[] = product.rubric?.attributesGroupIds || [];
  let cmsCardAttributeIds: ObjectIdModel[] = product.rubric?.cmsCardAttributeIds || [];
  if (categoriesList.length > 0) {
    cmsCardAttributeIds = categoriesList.reduce((acc: ObjectIdModel[], category) => {
      const categoryCmsCardAttributeIds = category.cmsCardAttributeIds.reduce(
        (innerAcc: ObjectIdModel[], attributeId) => {
          const exist = acc.some((_id) => {
            return _id.equals(attributeId);
          });
          if (exist) {
            return innerAcc;
          }
          return [...innerAcc, attributeId];
        },
        [],
      );
      return [...acc, ...categoryCmsCardAttributeIds];
    }, []);
  }

  const rubricAttributeGroups = await attributesGroupsCollection
    .aggregate<AttributesGroupInterface>([
      {
        $match: {
          _id: {
            $in: attributesGroupIds,
          },
        },
      },
      // get attributes
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
                _id: {
                  $in: cmsCardAttributeIds,
                },
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
    ])
    .toArray();

  // Get product attribute groups
  const productAttributesGroups: ProductAttributesGroupInterface[] = [];
  for await (const group of rubricAttributeGroups) {
    const stringAttributesAST: ProductAttributeInterface[] = [];
    const numberAttributesAST: ProductAttributeInterface[] = [];
    const multipleSelectAttributesAST: ProductAttributeInterface[] = [];
    const selectAttributesAST: ProductAttributeInterface[] = [];

    for await (const attribute of group.attributes || []) {
      const currentProductAttribute = product.attributes.find(({ attributeId }) => {
        return attributeId.equals(attribute._id);
      });
      let productAttribute: ProductAttributeInterface | null = null;

      if (currentProductAttribute) {
        let attributeOptions: OptionInterface[] = [];
        if (currentProductAttribute.optionIds.length > 0) {
          attributeOptions = await optionsCollection
            .find({
              _id: {
                $in: currentProductAttribute.optionIds,
              },
            })
            .toArray();
        }

        productAttribute = {
          ...currentProductAttribute,
          readableValue: getFieldStringLocale(
            currentProductAttribute.readableValueI18n,
            props.sessionLocale,
          ),
          attribute: {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
            options: attributeOptions.map((option) => {
              return {
                ...option,
                name: getFieldStringLocale(option.nameI18n, props.sessionLocale),
              };
            }),
          },
        };
      } else {
        productAttribute = {
          _id: new ObjectId(),
          attribute: {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, props.sessionLocale),
            options: [],
          },
          readableValueI18n: {},
          attributeId: attribute._id,
          readableValue: '',
          optionIds: [],
          filterSlugs: [],
          number: undefined,
          textI18n: {},
        };
      }

      const { variant } = attribute;

      if (variant === ATTRIBUTE_VARIANT_STRING) {
        stringAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_NUMBER) {
        numberAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
        multipleSelectAttributesAST.push(productAttribute);
      }

      if (variant === ATTRIBUTE_VARIANT_SELECT) {
        selectAttributesAST.push(productAttribute);
      }
    }

    const productAttributesGroup: ProductAttributesGroupInterface = {
      ...group,
      name: getFieldStringLocale(group.nameI18n),
      attributes: [],
      stringAttributesAST: sortObjectsByField(stringAttributesAST),
      numberAttributesAST: sortObjectsByField(numberAttributesAST),
      multipleSelectAttributesAST: sortObjectsByField(multipleSelectAttributesAST),
      selectAttributesAST: sortObjectsByField(selectAttributesAST),
    };

    productAttributesGroups.push(productAttributesGroup);
  }

  const finalProduct: ProductSummaryInterface = {
    ...product,
    attributesGroups: sortObjectsByField(productAttributesGroups),
  };

  return {
    ...props,
    product: castDbData(finalProduct),
  };
};
