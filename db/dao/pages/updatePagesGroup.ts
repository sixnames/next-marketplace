import { COL_PAGES_GROUP, COL_PAGES_GROUP_TEMPLATES } from 'db/collectionNames';
import { PagesGroupPayloadModel, TranslationModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updatePagesGroupSchema } from 'validation/pagesSchema';

export interface UpdatePagesGroupInputInterface {
  _id: string;
  nameI18n: TranslationModel;
  index: number;
  companySlug: string;
  showInFooter: boolean;
  showInHeader: boolean;
  isTemplate?: boolean | null;
}

export async function updatePagesGroup({
  context,
  input,
}: DaoPropsInterface<UpdatePagesGroupInputInterface>): Promise<PagesGroupPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updatePagesGroup',
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
        message: await getApiMessage('pageGroups.update.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updatePagesGroupSchema,
    });
    await validationSchema.validate(input);

    const { isTemplate } = input;
    const pagesGroupsCollection = isTemplate
      ? collections.pagesGroupTemplatesCollection()
      : collections.pagesGroupsCollection();

    // check availability
    const { _id, ...values } = input;
    const pagesGroupId = new ObjectId(_id);
    const pagesGroup = await pagesGroupsCollection.findOne({ _id: pagesGroupId });
    if (!pagesGroup) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.update.notFound'),
      };
    }

    // Check if pages group already exist
    const exist = await findDocumentByI18nField({
      collectionName: isTemplate ? COL_PAGES_GROUP_TEMPLATES : COL_PAGES_GROUP,
      fieldName: 'nameI18n',
      fieldArg: input.nameI18n,
      additionalQuery: {
        companySlug: pagesGroup.companySlug,
        _id: {
          $ne: _id,
        },
      },
      additionalOrQuery: [
        {
          _id: {
            $ne: pagesGroupId,
          },
          index: input.index,
          companySlug: pagesGroup.companySlug,
        },
      ],
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.update.duplicate'),
      };
    }

    const updatedPagesGroupResult = await pagesGroupsCollection.findOneAndUpdate(
      {
        _id: pagesGroupId,
      },
      {
        $set: {
          ...values,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedPagesGroup = updatedPagesGroupResult.value;
    if (!updatedPagesGroupResult.ok || !updatedPagesGroup) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('pageGroups.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
