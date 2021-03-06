import { COL_PAGE_TEMPLATES, COL_PAGES } from 'db/collectionNames';
import { PagePayloadModel, PageStateModel, TranslationModel } from 'db/dbModels';
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
import { updatePageSchema } from 'validation/pagesSchema';

export interface UpdatePageInputInterface {
  _id: string;
  nameI18n: TranslationModel;
  titleI18n?: TranslationModel | null;
  descriptionI18n?: TranslationModel | null;
  index: number;
  pagesGroupId: string;
  citySlug: string;
  content: string;
  state: PageStateModel;
  showAsMainBanner?: boolean | null;
  mainBannerTextColor?: string | null;
  mainBannerVerticalTextAlign?: string | null;
  mainBannerHorizontalTextAlign?: string | null;
  mainBannerTextAlign?: string | null;
  mainBannerTextPadding?: number | null;
  mainBannerTextMaxWidth?: number | null;
  showAsSecondaryBanner?: boolean | null;
  secondaryBannerTextColor?: string | null;
  secondaryBannerVerticalTextAlign?: string | null;
  secondaryBannerHorizontalTextAlign?: string | null;
  secondaryBannerTextAlign?: string | null;
  secondaryBannerTextPadding?: number | null;
  secondaryBannerTextMaxWidth?: number | null;
  isTemplate?: boolean | null;
}

export async function updatePage({
  context,
  input,
}: DaoPropsInterface<UpdatePageInputInterface>): Promise<PagePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updatePage',
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
        message: await getApiMessage('pages.update.error'),
      };
    }

    // validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updatePageSchema,
    });
    await validationSchema.validate(input);

    const { _id, isTemplate, pagesGroupId, ...values } = input;
    const pageId = new ObjectId(input._id);
    const pagesGroupObjectId = new ObjectId(input.pagesGroupId);
    const pagesGroupsCollection = isTemplate
      ? collections.pagesGroupTemplatesCollection()
      : collections.pagesGroupsCollection();
    const pagesCollection = isTemplate
      ? collections.pageTemplatesCollection()
      : collections.pagesCollection();

    // check availability
    const page = await pagesCollection.findOne({ _id: pageId });
    if (!page) {
      return {
        success: false,
        message: await getApiMessage('pages.update.notFound'),
      };
    }

    // check if already exist
    const exist = await findDocumentByI18nField({
      collectionName: isTemplate ? COL_PAGE_TEMPLATES : COL_PAGES,
      fieldName: 'nameI18n',
      fieldArg: input.nameI18n,
      additionalQuery: {
        citySlug: page.citySlug,
        pagesGroupId,
        _id: {
          $ne: _id,
        },
      },
      additionalOrQuery: [
        {
          index: input.index,
        },
      ],
    });
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('pages.update.duplicate'),
      };
    }

    // get pages group
    const pagesGroup = await pagesGroupsCollection.findOne({ _id: pagesGroupObjectId });
    if (!pagesGroup) {
      return {
        success: false,
        message: await getApiMessage('pages.update.error'),
      };
    }

    // update
    const updatedPageResult = await pagesCollection.findOneAndUpdate(
      { _id: pageId },
      {
        $set: {
          ...values,
          pagesGroupId: pagesGroupObjectId,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedPage = updatedPageResult.value;
    if (!updatedPageResult.ok || !updatedPage) {
      return {
        success: false,
        message: await getApiMessage('pages.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('pages.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
