import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';

export interface AddPromoProductInputInterface {
  promoId: string;
  rubricId: string;
  addAll: boolean;
  shopProductIds: string[];
}

export async function addPromoProduct({
  input,
  context,
}: DaoPropsInterface<AddPromoProductInputInterface>) {
  try {
    const { getApiMessage } = await getRequestParams(context);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'addPromoProduct',
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
        message: await getApiMessage('promoProduct.create.error'),
      };
    }

    return {
      success: true,
      message: '',
    };
  } catch (e) {
    console.log('addPromoProduct error ', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
