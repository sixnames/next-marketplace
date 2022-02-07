import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { updateCitiesSeoContent } from 'lib/seoContentUniquenessUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ProductPayloadModel } from 'db/dbModels';
import { DaoPropsInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';

export interface UpdateProductCardContentInputInterface {
  seoContentsList: SeoContentCitiesInterface;
  companySlug: string;
}

export async function updateProductCardContent({
  context,
  input,
}: DaoPropsInterface<UpdateProductCardContentInputInterface>): Promise<ProductPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('products.update.error'),
      };
    }

    // Permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateProductSeoContent',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    const { seoContentsList, companySlug } = input;
    await updateCitiesSeoContent({
      seoContentsList,
      companySlug,
    });

    return {
      success: true,
      message: await getApiMessage('products.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
