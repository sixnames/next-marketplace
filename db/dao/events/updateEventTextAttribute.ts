import { ObjectId } from 'mongodb';
import { DEFAULT_LOCALE, SECONDARY_LOCALE } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from 'lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { EventPayloadModel, TranslationModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  DaoPropsInterface,
  EventSummaryInterface,
  ProductAttributeInterface,
} from 'db/uiInterfaces';

export interface UpdateEventTextAttributeItemInputInterface {
  productAttributeId: string;
  attributeId: string;
  textI18n?: TranslationModel | null;
}

export interface UpdateEventTextAttributeInputInterface {
  eventId: string;
  attributes: UpdateEventTextAttributeItemInputInterface[];
  taskId?: string | null;
}

export async function updateEventTextAttribute({
  input,
  context,
}: DaoPropsInterface<UpdateEventTextAttributeInputInterface>): Promise<EventPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const eventSummariesCollection = collections.eventSummariesCollection();
  const eventFacetsCollection = collections.eventFacetsCollection();
  const attributesCollection = collections.attributesCollection();

  const session = collections.client.startSession();

  let mutationPayload: EventPayloadModel = {
    success: false,
    message: await getApiMessage('events.update.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateEventAttributes',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // check input
      if (!input) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // get summary
      const summary = await eventSummariesCollection.findOne({
        _id: new ObjectId(input.eventId),
      });
      if (!summary) {
        await session.abortTransaction();
        return;
      }

      let productAttributes = summary.attributes;
      let attributeIds = summary.attributeIds;

      for await (const inputAttribute of input.attributes) {
        const { textI18n } = inputAttribute;
        const productAttributeId = new ObjectId(inputAttribute.productAttributeId);
        const attributeId = new ObjectId(inputAttribute.attributeId);

        // remove attribute if value not set
        if (!textI18n || !textI18n[DEFAULT_LOCALE]) {
          productAttributes = productAttributes.filter((productAttribute) => {
            return !productAttribute.attributeId.equals(attributeId);
          });
          attributeIds = attributeIds.filter((_id) => {
            return !_id.equals(attributeId);
          });
          continue;
        }

        // get product attribute
        let productAttribute = await summary.attributes.find(({ _id }) => {
          return _id.equals(productAttributeId);
        });

        // get attribute
        const attribute = await attributesCollection.findOne({ _id: attributeId });
        if (!attribute) {
          continue;
        }
        const productAttributeNotExist = !productAttribute;

        // create new product attribute if original is absent
        if (!productAttribute) {
          productAttribute = {
            _id: productAttributeId,
            attributeId,
            optionIds: [],
            filterSlugs: [],
            number: null,
            textI18n,
            readableValueI18n: {},
          };
        }
        const readableValueI18n = getAttributeReadableValueLocales({
          productAttribute: {
            ...productAttribute,
            attribute,
          },
        });
        productAttribute.readableValueI18n = readableValueI18n;

        // add new attribute
        if (productAttributeNotExist) {
          productAttributes.push(productAttribute);
          attributeIds.push(attributeId);
          continue;
        }

        if (
          productAttribute.textI18n?.[DEFAULT_LOCALE] !== textI18n[DEFAULT_LOCALE] ||
          productAttribute.textI18n?.[SECONDARY_LOCALE] !== textI18n[SECONDARY_LOCALE]
        ) {
          productAttribute.textI18n = textI18n;
          // update existing attribute
          productAttributes = productAttributes.reduce(
            (acc: ProductAttributeInterface[], prevProductAttribute) => {
              if (prevProductAttribute._id.equals(productAttributeId) && productAttribute) {
                return [...acc, productAttribute];
              }
              return [...acc, prevProductAttribute];
            },
            [],
          );
        }
      }

      // update documents
      const updatedSummary: EventSummaryInterface = {
        ...summary,
        attributeIds,
        attributes: productAttributes,
      };
      const updatedProductAttributeResult = await eventSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            attributeIds: updatedSummary.attributeIds,
            attributes: updatedSummary.attributes.map((productAttribute) => {
              return {
                _id: productAttribute._id,
                attributeId: productAttribute.attributeId,
                filterSlugs: productAttribute.filterSlugs,
                optionIds: productAttribute.optionIds,
                readableValueI18n: productAttribute.readableValueI18n,
                number: productAttribute.number,
                textI18n: productAttribute.textI18n,
              };
            }),
          },
        },
      );
      if (!updatedProductAttributeResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.update.error'),
        };
        await session.abortTransaction();
        return;
      }
      await eventFacetsCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            attributeIds: updatedSummary.attributeIds,
          },
        },
      );

      mutationPayload = {
        success: true,
        message: await getApiMessage('events.update.success'),
        payload: summary,
      };
    });
    return mutationPayload;
  } catch (e) {
    console.log('updateEventTextAttribute error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
