import { COL_PAGE_TEMPLATES, COL_PAGES } from 'db/collectionNames';
import { PagePayloadModel, TranslationModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import { PAGE_EDITOR_DEFAULT_VALUE_STRING, PAGE_STATE_PUBLISHED } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { createPageSchema } from 'validation/pagesSchema';

export interface CreatePageInputInterface {
  nameI18n: TranslationModel;
  descriptionI18n?: TranslationModel | null;
  index: number;
  pagesGroupId: string;
  citySlug: string;
  isTemplate?: boolean | null;
}

export async function createPage({
  context,
  input,
}: DaoPropsInterface<CreatePageInputInterface>): Promise<PagePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'createPage',
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
        message: await getApiMessage('pages.create.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: createPageSchema,
    });
    await validationSchema.validate(input);

    const { isTemplate } = input;
    const pagesGroupsCollection = isTemplate
      ? collections.pagesGroupTemplatesCollection()
      : collections.pagesGroupsCollection();
    const pagesCollection = isTemplate
      ? collections.pageTemplatesCollection()
      : collections.pagesCollection();

    // check if already exist
    const exist = await findDocumentByI18nField({
      collectionName: isTemplate ? COL_PAGE_TEMPLATES : COL_PAGES,
      fieldName: 'nameI18n',
      fieldArg: input.nameI18n,
      additionalQuery: {
        pagesGroupId: input.pagesGroupId,
        citySlug: input.citySlug,
      },
      additionalOrQuery: [
        {
          index: input.index,
          pagesGroupId: input.pagesGroupId,
          citySlug: input.citySlug,
        },
      ],
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('pages.create.duplicate'),
      };
    }

    // get pages group
    const pagesGroupId = new ObjectId(input.pagesGroupId);
    const pagesGroup = await pagesGroupsCollection.findOne({ _id: pagesGroupId });
    if (!pagesGroup) {
      return {
        success: false,
        message: await getApiMessage('pages.create.error'),
      };
    }

    // create
    const createdPageResult = await pagesCollection.insertOne({
      ...input,
      pagesGroupId,
      slug: await getNextItemId(isTemplate ? COL_PAGE_TEMPLATES : COL_PAGES),
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      assetKeys: [],
      state: PAGE_STATE_PUBLISHED,
      companySlug: pagesGroup.companySlug,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!createdPageResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('pages.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('pages.create.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
