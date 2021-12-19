import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_COMPANIES, COL_USER_CATEGORIES } from '../../collectionNames';
import { CompanyModel, UserCategoryModel, UserCategoryPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
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
    const { db } = await getDatabase();
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
    const userCategoriesCollection = db.collection<UserCategoryModel>(COL_USER_CATEGORIES);
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
