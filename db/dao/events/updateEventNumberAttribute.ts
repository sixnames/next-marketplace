import { ObjectId } from 'mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from 'lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { EventPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import {
  DaoPropsInterface,
  EventSummaryInterface,
  ProductAttributeInterface,
} from 'db/uiInterfaces';

export interface UpdateEventNumberAttributeItemInputInterface {
  productAttributeId: string;
  attributeId: string;
  number?: number | null;
}

export interface UpdateEventNumberAttributeInputInterface {
  eventId: string;
  taskId?: string | null;
  attributes: UpdateEventNumberAttributeItemInputInterface[];
}

export async function updateEventNumberAttribute({
  input,
  context,
}: DaoPropsInterface<UpdateEventNumberAttributeInputInterface>): Promise<EventPayloadModel> {
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
        slug: 'updateProductAttributes',
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
        const { number } = inputAttribute;
        const productAttributeId = new ObjectId(inputAttribute.productAttributeId);
        const attributeId = new ObjectId(inputAttribute.attributeId);

        // remove attribute if value not set
        if (!number && number !== 0) {
          productAttributes = productAttributes.filter((productAttribute) => {
            return !productAttribute.attributeId.equals(attributeId);
          });
          attributeIds = attributeIds.filter((_id) => {
            return !_id.equals(attributeId);
          });
          continue;
        }

        // get product attribute
        let productAttribute = summary.attributes.find(({ _id }) => {
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
            number,
            textI18n: {},
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

        if (productAttribute.number !== number) {
          productAttribute.number = number;

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

      // create task log for content manager
      const updatedSummary: EventSummaryInterface = {
        ...summary,
        attributeIds,
        attributes: productAttributes,
      };

      // update documents
      const updatedEventAttributeResult = await eventSummariesCollection.findOneAndUpdate(
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
      if (!updatedEventAttributeResult.ok) {
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
    console.log('updateEventNumberAttribute error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
