import { COL_PAGE_TEMPLATES, COL_PAGES } from 'db/collectionNames';
import { PageModel, PagePayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { deleteUpload } from 'lib/assetUtils/assetUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeletePageInputInterface {
  _id: string;
  isTemplate?: boolean | null;
}

export async function deletePage({
  context,
  input,
}: DaoPropsInterface<DeletePageInputInterface>): Promise<PagePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'deletePage',
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
        message: await getApiMessage('pages.update.error'),
      };
    }

    const { isTemplate } = input;
    const pagesCollection = db.collection<PageModel>(isTemplate ? COL_PAGE_TEMPLATES : COL_PAGES);

    // check availability
    const _id = new ObjectId(input._id);
    const page = await pagesCollection.findOne({ _id });
    if (!page) {
      return {
        success: false,
        message: await getApiMessage('pages.delete.notFound'),
      };
    }

    // delete assets from cloud
    for await (const filePath of page.assetKeys) {
      await deleteUpload({
        filePath,
      });
    }

    // delete
    const removedPageResult = await pagesCollection.findOneAndDelete({ _id });
    if (!removedPageResult.ok) {
      return {
        success: false,
        message: await getApiMessage('pages.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('pages.delete.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
