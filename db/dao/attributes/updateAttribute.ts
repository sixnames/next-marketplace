import { COL_ATTRIBUTES } from 'db/collectionNames';
import { AttributePayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updateAttributeInGroupSchema } from 'validation/attributesGroupSchema';
import { CreateAttributeInputInterface } from './createAttribute';

export interface UpdateAttributeInputInterface extends CreateAttributeInputInterface {
  attributeId: string;
}

export async function updateAttribute({
  context,
  input,
}: DaoPropsInterface<UpdateAttributeInputInterface>): Promise<AttributePayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const collections = await getDbCollections();
  const attributesGroupCollection = collections.attributesGroupsCollection();
  const attributesCollection = collections.attributesCollection();
  const metricsCollection = collections.metricsCollection();

  const session = collections.client.startSession();

  let mutationPayload: AttributePayloadModel = {
    success: false,
    message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateAttribute',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: updateAttributeInGroupSchema,
      });
      await validationSchema.validate(input);

      const { attributesGroupId, attributeId, optionsGroupId, metricId, ...values } = input;
      const attributesGroupObjectId = new ObjectId(attributesGroupId);
      const attributeObjectId = new ObjectId(attributeId);
      const metricObjectId = metricId ? new ObjectId(metricId) : null;
      const optionsGroupObjectId = optionsGroupId ? new ObjectId(optionsGroupId) : null;

      // check attributes group availability
      const group = await attributesGroupCollection.findOne({
        _id: attributesGroupObjectId,
      });
      if (!group) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
        };
        await session.abortTransaction();
        return;
      }

      // check attribute availability
      const attribute = await attributesCollection.findOne({
        _id: attributeObjectId,
      });
      if (!attribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
        };
        await session.abortTransaction();
        return;
      }

      // check if attribute exist
      const exist = await findDocumentByI18nField({
        fieldArg: input.nameI18n,
        collectionName: COL_ATTRIBUTES,
        fieldName: 'nameI18n',
        additionalQuery: {
          $and: [{ _id: { $in: group.attributesIds } }, { _id: { $ne: attributeObjectId } }],
        },
      });
      if (exist) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.duplicate`),
        };
        await session.abortTransaction();
        return;
      }

      // get metric
      let metric = null;
      if (metricObjectId) {
        metric = await metricsCollection.findOne({ _id: new ObjectId(metricObjectId) });
      }

      // update attribute
      const updatedAttributeResult = await attributesCollection.findOneAndUpdate(
        { _id: attributeObjectId },
        {
          $set: {
            ...values,
            optionsGroupId: optionsGroupObjectId,
            metric,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedAttribute = updatedAttributeResult.value;
      if (!updatedAttributeResult.ok || !updatedAttribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('attributesGroups.updateAttribute.success'),
        payload: updatedAttribute,
      };
    });

    return mutationPayload;
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
