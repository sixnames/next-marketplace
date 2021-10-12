import { COL_COMPANIES, COL_USER_CATEGORIES } from 'db/collectionNames';
import {
  CompanyModel,
  TranslationModel,
  UserCategoryModel,
  UserCategoryPayloadModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getApiResolverValidationSchema,
  getOperationPermission,
  getRequestParams,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updateUserCategorySchema } from 'validation/userCategorySchema';

export interface UpdateUserCategoryInputInterface {
  _id: string;
  companyId: string;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel;
  entryMinCharge: number;
  discountPercent: number;
  cashbackPercent: number;
  payFromCashbackPercent: number;
}

export async function updateUserCategory({
  context,
  input,
}: DaoPropsInterface<UpdateUserCategoryInputInterface>): Promise<UserCategoryPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
    const userCategoriesCollection = db.collection<UserCategoryModel>(COL_USER_CATEGORIES);
    const errorPayload = {
      success: false,
      message: await getApiMessage('userCategories.update.error'),
    };

    // chek input
    if (!input) {
      return errorPayload;
    }

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateUserCategory',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // validate
    const validationSchema = await getApiResolverValidationSchema({
      ...context,
      schema: updateUserCategorySchema,
    });
    await validationSchema.validate(input);

    // get company
    const companyId = new ObjectId(input.companyId);
    const company = await companiesCollection.findOne({
      _id: companyId,
    });
    if (!company) {
      return errorPayload;
    }

    // create
    const { _id, ...values } = input;
    const createdUserCategoryResult = await userCategoriesCollection.findOneAndUpdate(
      {
        _id: new ObjectId(_id),
      },
      {
        ...values,
        companyId,
        updatedAt: new Date(),
      },
    );
    if (!createdUserCategoryResult.ok) {
      return errorPayload;
    }

    return {
      success: true,
      message: await getApiMessage('userCategories.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
