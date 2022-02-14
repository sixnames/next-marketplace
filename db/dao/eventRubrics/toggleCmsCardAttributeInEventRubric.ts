import { COL_ATTRIBUTES, COL_EVENT_RUBRICS } from 'db/collectionNames';
import { AttributeModel, EventRubricModel, EventRubricPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface ToggleCmsCardAttributeInEventRubricInputInterface {
  rubricId: string;
  attributeIds: string[];
  attributesGroupId: string;
}

export async function toggleCmsCardAttributeInEventRubric({
  context,
  input,
}: DaoPropsInterface<ToggleCmsCardAttributeInEventRubricInputInterface>): Promise<EventRubricPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const rubricsCollection = db.collection<EventRubricModel>(COL_EVENT_RUBRICS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

  const session = client.startSession();

  let mutationPayload: EventRubricPayloadModel = {
    success: false,
    message: await getApiMessage('rubrics.update.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateRubric',
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
          message: await getApiMessage('rubrics.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // get rubric
      const attributesGroupId = new ObjectId(input.attributesGroupId);
      const rubricId = new ObjectId(input.rubricId);
      const attributeIds = input.attributeIds.map((_id) => new ObjectId(_id));
      const rubric = await rubricsCollection.findOne({ _id: rubricId });
      if (!rubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.update.notFound'),
        };
        await session.abortTransaction();
        return;
      }

      // get group attributes
      const groupAttributes = await attributesCollection
        .find({
          attributesGroupId,
        })
        .toArray();
      const groupAttributeIds = groupAttributes.map(({ _id }) => _id);

      // uncheck all
      if (attributeIds.length < 1) {
        const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
          { _id: rubricId },
          {
            $pullAll: {
              cmsCardAttributeIds: groupAttributeIds,
            },
          },
          {
            returnDocument: 'after',
          },
        );
        const updatedRubric = updatedRubricResult.value;
        if (!updatedRubricResult.ok || !updatedRubric) {
          mutationPayload = {
            success: false,
            message: await getApiMessage('rubrics.update.error'),
          };
          await session.abortTransaction();
          return;
        }
        mutationPayload = {
          success: true,
          message: await getApiMessage('rubrics.update.success'),
        };
        await session.abortTransaction();
        return;
      }

      // check all
      if (attributeIds.length === groupAttributeIds.length && attributeIds.length !== 1) {
        const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
          { _id: rubricId },
          {
            $addToSet: {
              cmsCardAttributeIds: {
                $each: groupAttributeIds,
              },
            },
          },
          {
            returnDocument: 'after',
          },
        );
        const updatedRubric = updatedRubricResult.value;
        if (!updatedRubricResult.ok || !updatedRubric) {
          mutationPayload = {
            success: false,
            message: await getApiMessage('rubrics.update.error'),
          };
          await session.abortTransaction();
          return;
        }
        mutationPayload = {
          success: true,
          message: await getApiMessage('rubrics.update.success'),
        };
        await session.abortTransaction();
        return;
      }

      // get attributes
      const rubricAttributes = groupAttributes.filter((attribute) => {
        return attributeIds.some((_id) => attribute._id.equals(_id));
      });

      let cmsCardAttributeIds = [...(rubric.cmsCardAttributeIds || [])];
      for await (const rubricAttribute of rubricAttributes) {
        const attributeId = rubricAttribute._id;
        const attributeExist = rubric.cmsCardAttributeIds?.some((_id) => {
          return _id.equals(attributeId);
        });
        if (attributeExist) {
          cmsCardAttributeIds = cmsCardAttributeIds.filter((_id) => {
            return !_id.equals(attributeId);
          });
        } else {
          cmsCardAttributeIds.push(attributeId);
        }
      }

      const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
        { _id: rubricId },
        {
          $set: {
            cmsCardAttributeIds,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedRubric = updatedRubricResult.value;
      if (!updatedRubricResult.ok || !updatedRubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('rubrics.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('rubrics.update.success'),
        payload: updatedRubric,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('toggleCmsCardAttributeInEventRubric error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
