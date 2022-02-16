import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { noNaN } from 'lib/numbers';
import {
  getApiResolverValidationSchema,
  getOperationPermission,
  getRequestParams,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updateUserCategorySchema } from 'validation/userCategorySchema';
import { TranslationModel, UserCategoryPayloadModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateUserCategoryInputInterface {
  _id: string;
  companyId: string;
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel;
  entryMinCharge?: number | null;
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
    const collections = await getDbCollections();
    const companiesCollection = collections.companiesCollection();
    const userCategoriesCollection = collections.userCategoriesCollection();
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
    const updatedUserCategoryResult = await userCategoriesCollection.findOneAndUpdate(
      {
        _id: new ObjectId(_id),
      },
      {
        $set: {
          ...values,
          companyId,
          cashbackPercent: noNaN(values.cashbackPercent),
          discountPercent: noNaN(values.discountPercent),
          payFromCashbackPercent: noNaN(values.payFromCashbackPercent),
          entryMinCharge: values.entryMinCharge || null,
          updatedAt: new Date(),
        },
      },
    );
    if (!updatedUserCategoryResult.ok) {
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
