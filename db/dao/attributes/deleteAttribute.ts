import { COL_ATTRIBUTES, COL_ATTRIBUTES_GROUPS, COL_PRODUCT_ATTRIBUTES } from 'db/collectionNames';
import {
  AttributeModel,
  AttributePayloadModel,
  AttributesGroupModel,
  ProductAttributeModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeleteAttributeInputInterface {
  attributeId: string;
  attributesGroupId: string;
}

export async function deleteAttribute({
  context,
  input,
}: DaoPropsInterface<DeleteAttributeInputInterface>): Promise<AttributePayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productAttributesCollection = db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
  const attributesGroupCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

  const session = client.startSession();

  let mutationPayload: AttributePayloadModel = {
    success: false,
    message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
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
        slug: 'deleteAttribute',
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

      // check if attributes group exist
      const attributesGroup = await attributesGroupCollection.findOne({
        _id: attributesGroupId,
      });
      if (!attributesGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
        };
        await session.abortTransaction();
        return;
      }

      // check attribute availability
      const attribute = await attributesCollection.findOne({
        _id: attributeId,
      });
      if (!attribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
        };
        await session.abortTransaction();
        return;
      }

      // delete product attributes
      const removedProductAttributes = await productAttributesCollection.deleteMany({
        attributeId,
      });
      if (!removedProductAttributes.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
        };
        await session.abortTransaction();
        return;
      }

      // remove attribute
      const removedAttributeResult = await attributesCollection.findOneAndDelete({
        _id: attributeId,
      });
      if (!removedAttributeResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
        };
        await session.abortTransaction();
        return;
      }

      // remove attribute _id from attributes group
      const updatedGroupResult = await attributesGroupCollection.findOneAndUpdate(
        { _id: attributesGroup._id },
        {
          $pull: {
            attributesIds: attributeId,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedGroup = updatedGroupResult.value;
      if (!updatedGroupResult.ok || !updatedGroup) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('attributesGroups.deleteAttribute.success'),
        payload: attribute,
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
