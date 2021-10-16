import { COL_PAGES_GROUP, COL_PAGES_GROUP_TEMPLATES } from 'db/collectionNames';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import { PagesGroupModel, PagesGroupPayloadModel, TranslationModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { createPagesGroupSchema } from 'validation/pagesSchema';

export interface CreatePagesGroupInputInterface {
  nameI18n: TranslationModel;
  index: number;
  companySlug: string;
  showInFooter: boolean;
  showInHeader: boolean;
  isTemplate?: boolean | null;
}

export async function createPagesGroup({
  context,
  input,
}: DaoPropsInterface<CreatePagesGroupInputInterface>): Promise<PagesGroupPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createPagesGroup',
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
        message: await getApiMessage('pageGroups.create.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createPagesGroupSchema,
    });
    await validationSchema.validate(input);

    const { isTemplate } = input;
    const pagesGroupsCollection = db.collection<PagesGroupModel>(
      isTemplate ? COL_PAGES_GROUP_TEMPLATES : COL_PAGES_GROUP,
    );

    // check if already exist
    const exist = await findDocumentByI18nField({
      collectionName: isTemplate ? COL_PAGES_GROUP_TEMPLATES : COL_PAGES_GROUP,
      fieldName: 'nameI18n',
      fieldArg: input.nameI18n,
      additionalQuery: {
        companySlug: input.companySlug,
      },
      additionalOrQuery: [
        {
          index: input.index,
          companySlug: input.companySlug,
        },
      ],
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.create.duplicate'),
      };
    }

    // create
    const createdPagesGroupResult = await pagesGroupsCollection.insertOne({
      ...input,
    });
    if (!createdPagesGroupResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('pageGroups.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('pageGroups.create.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
