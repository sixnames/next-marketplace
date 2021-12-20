import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import {
  COL_PAGE_TEMPLATES,
  COL_PAGES,
  COL_PAGES_GROUP,
  COL_PAGES_GROUP_TEMPLATES,
} from '../../collectionNames';
import { PageModel, PagesGroupModel, PagesGroupPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

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
  const { db, client } = await getDatabase();
  const pagesGroupsCollection = db.collection<PagesGroupModel>(
    isTemplate ? COL_PAGES_GROUP_TEMPLATES : COL_PAGES_GROUP,
  );
  const pagesCollection = db.collection<PageModel>(isTemplate ? COL_PAGE_TEMPLATES : COL_PAGES);

  const session = client.startSession();

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
