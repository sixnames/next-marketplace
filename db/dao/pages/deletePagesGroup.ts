import { PagesGroupPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeletePagesGroupInputInterface {
  _id: string;
  isTemplate?: boolean | null;
}

export async function deletePagesGroup({
  context,
  input,
}: DaoPropsInterface<DeletePagesGroupInputInterface>): Promise<PagesGroupPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);

  // permission
  const { allow, message } = await getOperationPermission({
    context,
    slug: 'deletePagesGroup',
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
      message: await getApiMessage('pageGroups.delete.error'),
    };
  }

  const { isTemplate } = input;
  const _id = new ObjectId(input._id);
  const collections = await getDbCollections();
  const pagesGroupsCollection = isTemplate
    ? collections.pagesGroupTemplatesCollection()
    : collections.pagesGroupsCollection();
  const pagesCollection = isTemplate
    ? collections.pageTemplatesCollection()
    : collections.pagesCollection();

  const session = collections.client.startSession();

  let mutationPayload: PagesGroupPayloadModel = {
    success: false,
    message: await getApiMessage('pageGroups.delete.error'),
  };

  try {
    await session.withTransaction(async () => {
      // Permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'deletePagesGroup',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // Delete pages
      const removedPagesResult = await pagesCollection.deleteMany({
        pagesGroupId: _id,
      });
      if (!removedPagesResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('pageGroups.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      // Delete pages group
      const removedPagesGroupResult = await pagesGroupsCollection.findOneAndDelete({
        _id,
      });
      if (!removedPagesGroupResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('pageGroups.delete.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('pageGroups.delete.success'),
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
