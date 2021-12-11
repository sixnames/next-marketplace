import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS, COL_METRICS } from 'db/collectionNames';
import { CreateAttributeInputInterface } from 'db/dao/attributes/createAttribute';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import {
  AttributeModel,
  AttributePayloadModel,
  AttributesGroupModel,
  MetricModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updateAttributeInGroupSchema } from 'validation/attributesGroupSchema';

export interface UpdateAttributeInputInterface extends CreateAttributeInputInterface {
  attributeId: string;
}

export async function updateAttribute({
  context,
  input,
}: DaoPropsInterface<UpdateAttributeInputInterface>): Promise<AttributePayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const attributesGroupCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const metricsCollection = db.collection<MetricModel>(COL_METRICS);

  const session = client.startSession();

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
