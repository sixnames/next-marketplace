import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { UserCategoryPayloadModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface DeleteUserCategoryInputInterface {
  _id: string;
  companyId: string;
}

export async function deleteUserCategory({
  context,
  input,
}: DaoPropsInterface<DeleteUserCategoryInputInterface>): Promise<UserCategoryPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const companiesCollection = collections.companiesCollection();
    const userCategoriesCollection = collections.userCategoriesCollection();
    const errorPayload = {
      success: false,
      message: await getApiMessage('userCategories.delete.error'),
    };

    // chek input
    if (!input) {
      return errorPayload;
    }

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'deleteUserCategory',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // get company
    const company = await companiesCollection.findOne({
      _id: new ObjectId(input.companyId),
    });
    if (!company) {
      return errorPayload;
    }

    // create
    const removedUserCategoryResult = await userCategoriesCollection.findOneAndDelete({
      _id: new ObjectId(input._id),
    });
    if (!removedUserCategoryResult.ok) {
      return errorPayload;
    }

    return {
      success: true,
      message: await getApiMessage('userCategories.delete.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
