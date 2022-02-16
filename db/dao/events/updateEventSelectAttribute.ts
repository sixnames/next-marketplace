import { COL_OPTIONS } from 'db/collectionNames';
import { EventPayloadModel, ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface, ProductAttributeInterface } from 'db/uiInterfaces';
import { FILTER_SEPARATOR } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from 'lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { getParentTreeIds } from 'lib/treeUtils';
import { ObjectId } from 'mongodb';

export interface UpdateEventSelectAttributeInputInterface {
  eventId: string;
  taskId?: string | null;
  productAttributeId: string;
  attributeId: string;
  selectedOptionsIds: string[];
}

export async function updateEventSelectAttribute({
  context,
  input,
}: DaoPropsInterface<UpdateEventSelectAttributeInputInterface>): Promise<EventPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const eventSummariesCollection = collections.eventSummariesCollection();
  const eventFacetsCollection = collections.eventFacetsCollection();
  const attributesCollection = collections.attributesCollection();
  const optionsCollection = collections.optionsCollection();

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

      const selectedOptionsIds = input.selectedOptionsIds.map((_id) => new ObjectId(_id));
      const attributeId = new ObjectId(input.attributeId);
      const productAttributeId = new ObjectId(input.productAttributeId);

      // get summary
      const summary = await eventSummariesCollection.findOne({
        _id: new ObjectId(input.eventId),
      });
      if (!summary) {
        await session.abortTransaction();
        return;
      }
      const updatedSummary = { ...summary };

      // get product attribute
      let productAttribute = summary.attributes.find((productAttribute) => {
        return productAttribute.attributeId.equals(attributeId);
      });
      const productAttributeNotExist = !productAttribute;

      // create new product attribute if original is absent
      if (!productAttribute) {
        productAttribute = {
          _id: productAttributeId,
          attributeId,
          optionIds: [],
          filterSlugs: [],
          number: undefined,
          textI18n: {},
          readableValueI18n: {},
        };
      }

      // get attribute
      const attribute = await attributesCollection.findOne({
        _id: attributeId,
      });
      if (!attribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('events.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // update product attribute
      // get selected options tree
      const finalOptionIds: ObjectIdModel[] = [];
      for await (const optionId of selectedOptionsIds) {
        const optionsTreeIds = await getParentTreeIds({
          collectionName: COL_OPTIONS,
          _id: optionId,
          acc: [],
        });
        optionsTreeIds.forEach((_id) => finalOptionIds.push(_id));
      }
      const finalOptions = await optionsCollection
        .find({
          _id: {
            $in: finalOptionIds,
          },
        })
        .toArray();
      const finalFilterSlugs = finalOptions.map(
        ({ slug }) => `${attribute.slug}${FILTER_SEPARATOR}${slug}`,
      );
      const oldFilterSlugs = [...productAttribute.filterSlugs];
      const readableValueI18n = getAttributeReadableValueLocales({
        productAttribute: {
          ...productAttribute,
          attribute: {
            ...attribute,
            options: finalOptions,
          },
        },
      });
      productAttribute.readableValueI18n = readableValueI18n;
      productAttribute.optionIds = finalOptionIds;
      productAttribute.filterSlugs = finalFilterSlugs;

      // remove attribute if value is empty
      if (finalOptionIds.length < 1) {
        updatedSummary.attributes = updatedSummary.attributes.filter((productAttribute) => {
          return !productAttribute.attributeId.equals(attributeId);
        });
        updatedSummary.attributeIds = updatedSummary.attributeIds.filter((existingAttributeId) => {
          return !existingAttributeId.equals(attributeId);
        });
        updatedSummary.filterSlugs = updatedSummary.filterSlugs.filter((filterSlug) => {
          return !oldFilterSlugs.includes(filterSlug);
        });
      } else {
        // add new attribute
        if (productAttributeNotExist) {
          updatedSummary.attributeIds.push(attributeId);
          updatedSummary.attributes.push(productAttribute);
          finalFilterSlugs.forEach((filterSlug) => {
            updatedSummary.filterSlugs.push(filterSlug);
          });
        } else {
          // update existing attribute
          updatedSummary.attributes = updatedSummary.attributes.reduce(
            (acc: ProductAttributeInterface[], prevProductAttribute) => {
              if (prevProductAttribute.attributeId.equals(attributeId) && productAttribute) {
                return [...acc, productAttribute];
              }
              return [...acc, prevProductAttribute];
            },
            [],
          );
          updatedSummary.filterSlugs = updatedSummary.filterSlugs.filter((filterSlug) => {
            return !oldFilterSlugs.includes(filterSlug);
          });
          finalFilterSlugs.forEach((filterSlug) => {
            updatedSummary.filterSlugs.push(filterSlug);
          });
        }
      }

      // update documents
      const updatedEventAttributeResult = await eventSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            filterSlugs: updatedSummary.filterSlugs,
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
            filterSlugs: updatedSummary.filterSlugs,
            attributeIds: updatedSummary.attributeIds,
          },
        },
      );

      // update product title
      mutationPayload = {
        success: true,
        message: await getApiMessage('events.update.success'),
        payload: summary,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateEventSelectAttribute', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
