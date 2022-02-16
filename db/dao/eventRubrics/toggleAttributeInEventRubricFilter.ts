import { EventRubricPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface ToggleAttributeInEventRubricFilterInputInterface {
  rubricId: string;
  attributeIds: string[];
  attributesGroupId: string;
}

export async function toggleAttributeInEventRubricFilter({
  context,
  input,
}: DaoPropsInterface<ToggleAttributeInEventRubricFilterInputInterface>): Promise<EventRubricPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const rubricsCollection = collections.eventRubricsCollection();
    const attributesCollection = collections.attributesCollection();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateRubric',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('rubrics.update.error'),
      };
    }

    // get rubric
    const attributesGroupId = new ObjectId(input.attributesGroupId);
    const rubricId = new ObjectId(input.rubricId);
    const attributeIds = input.attributeIds.map((_id) => new ObjectId(_id));
    const rubric = await rubricsCollection.findOne({ _id: rubricId });
    if (!rubric) {
      return {
        success: false,
        message: await getApiMessage('rubrics.update.notFound'),
      };
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
            filterVisibleAttributeIds: groupAttributeIds,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedRubric = updatedRubricResult.value;
      if (!updatedRubricResult.ok || !updatedRubric) {
        return {
          success: false,
          message: await getApiMessage('rubrics.update.error'),
        };
      }
      return {
        success: true,
        message: await getApiMessage('rubrics.update.success'),
        payload: updatedRubric,
      };
    }

    // check all
    if (attributeIds.length === groupAttributeIds.length && attributeIds.length !== 1) {
      const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
        { _id: rubricId },
        {
          $addToSet: {
            filterVisibleAttributeIds: {
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
        return {
          success: false,
          message: await getApiMessage('rubrics.update.error'),
        };
      }
      return {
        success: true,
        message: await getApiMessage('rubrics.update.success'),
        payload: updatedRubric,
      };
    }

    // get attributes
    const rubricAttributes = groupAttributes.filter((attribute) => {
      return attributeIds.some((_id) => attribute._id.equals(_id));
    });

    let filterVisibleAttributeIds = [...(rubric.filterVisibleAttributeIds || [])];
    for await (const rubricAttribute of rubricAttributes) {
      const attributeId = rubricAttribute._id;
      const attributeExist = rubric.filterVisibleAttributeIds?.some((_id) => {
        return _id.equals(attributeId);
      });
      if (attributeExist) {
        filterVisibleAttributeIds = filterVisibleAttributeIds.filter((_id) => {
          return !_id.equals(attributeId);
        });
      } else {
        filterVisibleAttributeIds.push(attributeId);
      }
    }

    const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
      { _id: rubricId },
      {
        $set: {
          filterVisibleAttributeIds,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedRubric = updatedRubricResult.value;
    if (!updatedRubricResult.ok || !updatedRubric) {
      return {
        success: false,
        message: await getApiMessage('rubrics.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('rubrics.update.success'),
      payload: updatedRubric,
    };
  } catch (e) {
    console.log('toggleAttributeInEventRubricFilter error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
