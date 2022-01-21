import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getRequestParams, getSessionRole } from '../../../lib/sessionHelpers';
import { SessionLogPayloadModel } from '../../dbModels';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface SetSessionLogInputInterface {}

const successMessage = 'success';

export async function setSessionLog({
  input,
  context,
}: DaoPropsInterface<SetSessionLogInputInterface>): Promise<SessionLogPayloadModel> {
  try {
    const { locale, citySlug, companySlug } = await getRequestParams(context);
    const { user, role } = await getSessionRole(context);

    // check if user is company or site staff
    if (role.isStaff || role.isCompanyStaff) {
      return {
        success: true,
        message: successMessage,
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: 'no input provided',
      };
    }

    console.log({
      locale,
      citySlug,
      companySlug,
      user,
    });

    return {
      success: true,
      message: successMessage,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
