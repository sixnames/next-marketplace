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
import { noNaN } from 'lib/numbers';
import {
  getApiResolverValidationSchema,
  getOperationPermission,
  getRequestParams,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { createUserCategorySchema } from 'validation/userCategorySchema';

export interface CreateUserCategoryInputInterface {
  companyId: string;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel;
  entryMinCharge?: number | null;
  discountPercent: number;
  cashbackPercent: number;
  payFromCashbackPercent: number;
}

export async function createUserCategory({
  context,
  input,
}: DaoPropsInterface<CreateUserCategoryInputInterface>): Promise<UserCategoryPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
    const userCategoriesCollection = db.collection<UserCategoryModel>(COL_USER_CATEGORIES);
    const errorPayload = {
      success: false,
      message: await getApiMessage('userCategories.create.error'),
    };

    // chek input
    if (!input) {
      return errorPayload;
    }

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createUserCategory',
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
      schema: createUserCategorySchema,
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
    const createdUserCategoryResult = await userCategoriesCollection.insertOne({
      ...input,
      companyId,
      cashbackPercent: noNaN(input.cashbackPercent),
      discountPercent: noNaN(input.discountPercent),
      payFromCashbackPercent: noNaN(input.payFromCashbackPercent),
      entryMinCharge: input.entryMinCharge || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!createdUserCategoryResult.acknowledged) {
      return errorPayload;
    }

    return {
      success: true,
      message: await getApiMessage('userCategories.create.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
