import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { updateCitiesSeoContent } from '../../../lib/seoContentUtils';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { ProductPayloadModel } from '../../dbModels';
import { DaoPropsInterface, SeoContentCitiesInterface } from '../../uiInterfaces';

export interface UpdateProductCardContentInputInterface {
  cardContent: SeoContentCitiesInterface;
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
      slug: 'updateProduct',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    const { cardContent, companySlug } = input;
    await updateCitiesSeoContent({
      seoContentsList: cardContent,
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
