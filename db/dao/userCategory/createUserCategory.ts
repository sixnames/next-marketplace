import { TranslationModel, UserCategoryPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
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
    const collections = await getDbCollections();
    const companiesCollection = collections.companiesCollection();
    const userCategoriesCollection = collections.userCategoriesCollection();
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
