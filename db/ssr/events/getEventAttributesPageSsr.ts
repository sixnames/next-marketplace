import { castAttributeForUI } from 'db/cast/castAttributesGroupForUI';
import { COL_ATTRIBUTES } from 'db/collectionNames';
import { ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  getEventFullSummary,
  GetFullEventSummaryPayloadInterface,
} from 'db/ssr/events/getEventFullSummary';
import {
  AttributesGroupInterface,
  EventSummaryInterface,
  OptionInterface,
  ProductAttributeInterface,
  ProductAttributesGroupInterface,
} from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  SORT_DESC,
} from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';

interface GetEventAttributesPageSsrInterface {
  eventId: string;
  locale: string;
}

export const getEventAttributesPageSsr = async ({
  eventId,
  locale,
}: GetEventAttributesPageSsrInterface): Promise<GetFullEventSummaryPayloadInterface | null> => {
  const collections = await getDbCollections();
  const attributesGroupsCollection = collections.attributesGroupsCollection();
  const optionsCollection = collections.optionsCollection();

  const summaryPayload = await getEventFullSummary({
    locale,
    eventId,
  });

  if (!summaryPayload) {
    return null;
  }

  const summary = summaryPayload.summary;
  const cardContent = summaryPayload.cardContent;

  const attributesGroupIds: ObjectIdModel[] = summary.rubric?.attributesGroupIds || [];
  let cmsCardAttributeIds: ObjectIdModel[] = summary.rubric?.cmsCardAttributeIds || [];

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
      const currentProductAttribute = summary.attributes.find(({ attributeId }) => {
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
          readableValue: getFieldStringLocale(currentProductAttribute.readableValueI18n, locale),
          attribute: castAttributeForUI({
            attribute: {
              ...attribute,
              options: attributeOptions,
            },
            locale,
          }),
        };
      } else {
        productAttribute = {
          _id: new ObjectId(),
          attribute: {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, locale),
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

  const finalProduct: EventSummaryInterface = {
    ...summary,
    attributesGroups: sortObjectsByField(productAttributesGroups),
  };

  return {
    summary: finalProduct,
    cardContent,
  };
};
