import { COL_BRANDS } from 'db/collectionNames';
import { CreateBrandInputInterface } from 'db/dao/brands/createBrand';
import { BrandModel, BrandPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { execUpdateProductTitles } from 'lib/updateProductTitles';
import { ObjectId } from 'mongodb';
import { updateBrandSchema } from 'validation/brandSchema';

export interface UpdateBrandInputInterface extends CreateBrandInputInterface {
  _id: string;
}

export async function updateBrand({
  context,
  input,
}: DaoPropsInterface<UpdateBrandInputInterface>): Promise<BrandPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const brandsCollection = collections.brandsCollection();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateBrand',
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
        message: await getApiMessage('brands.update.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updateBrandSchema,
    });
    await validationSchema.validate(input);

    // get brand
    const { _id, ...values } = input;
    const brand = await brandsCollection.findOne({ _id: new ObjectId(_id) });
    if (!brand) {
      return {
        success: false,
        message: await getApiMessage('brands.update.notFound'),
      };
    }

    // check if already exist
    const exist = await findDocumentByI18nField<BrandModel>({
      collectionName: COL_BRANDS,
      fieldName: 'nameI18n',
      fieldArg: values.nameI18n,
      additionalQuery: {
        _id: { $ne: brand._id },
      },
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('brands.update.duplicate'),
      };
    }

    // update
    const updatedBrandResult = await brandsCollection.findOneAndUpdate(
      { _id: brand._id },
      {
        $set: {
          ...values,
          url: (values.url || []).map((link) => {
            return `${link}`;
          }),
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );
    if (!updatedBrandResult.ok || !updatedBrandResult.value) {
      return {
        success: false,
        message: await getApiMessage('brands.update.error'),
      };
    }

    // update product algolia indexes
    execUpdateProductTitles(`brandSlug=${updatedBrandResult.value.itemId}`);

    return {
      success: true,
      message: await getApiMessage('brands.update.success'),
      payload: updatedBrandResult.value,
    };
  } catch (e) {
    console.log('updateBrand error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
