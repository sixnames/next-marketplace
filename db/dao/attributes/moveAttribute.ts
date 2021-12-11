import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS } from 'db/collectionNames';
import { AttributeModel, AttributePayloadModel, AttributesGroupModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface MoveAttributeInputInterface {
  attributeId: string;
  attributesGroupId: string;
}

export async function moveAttribute({
  context,
  input,
}: DaoPropsInterface<MoveAttributeInputInterface>): Promise<AttributePayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const attributesGroupCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

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

      const attributesGroupId = new ObjectId(input.attributesGroupId);
      const attributeId = new ObjectId(input.attributeId);

      // check if attribute exist
      const attribute = await attributesCollection.findOne({
        _id: attributeId,
      });
      if (!attribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
        };
        await session.abortTransaction();
        return;
      }

      // check if old attributes group exist
      const oldAttributesGroup = await attributesGroupCollection.findOne({
        _id: attribute.attributesGroupId,
      });
      if (!oldAttributesGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
        };
        await session.abortTransaction();
        return;
      }

      // check if new attributes group exist
      const newAttributesGroup = await attributesGroupCollection.findOne({
        _id: attributesGroupId,
      });
      if (!newAttributesGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
        };
        await session.abortTransaction();
        return;
      }

      // update attribute
      const updatedAttributeResult = await attributesCollection.findOneAndUpdate(
        {
          _id: attributeId,
        },
        {
          $set: {
            attributesGroupId,
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

      // remove attribute _id from old attributes group
      const updatedOldGroupResult = await attributesGroupCollection.findOneAndUpdate(
        { _id: oldAttributesGroup._id },
        {
          $pull: {
            attributesIds: attributeId,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedOldGroup = updatedOldGroupResult.value;
      if (!updatedOldGroupResult.ok || !updatedOldGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
        };
        await session.abortTransaction();
        return;
      }

      // add attribute _id to the new attributes group
      const updatedNewGroupResult = await attributesGroupCollection.findOneAndUpdate(
        { _id: attributesGroupId },
        {
          $push: {
            attributesIds: attributeId,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedNewGroup = updatedNewGroupResult.value;
      if (!updatedNewGroupResult.ok || !updatedNewGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
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
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
