import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { checkSeoContentUniqueness } from 'lib/seoContentUniquenessUtils';
import { getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { SeoContentPayloadModel, TranslationModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateSeoContentInputInterface {
  _id: string;
  slug: string;
  url: string;
  content: string;
  rubricSlug: string;
  companySlug: string;
  showForIndex?: boolean | null;
  titleI18n?: TranslationModel | null;
  metaTitleI18n?: TranslationModel | null;
  metaDescriptionI18n?: TranslationModel | null;
}

export async function updateSeoContent({
  input,
  context,
}: DaoPropsInterface<UpdateSeoContentInputInterface>): Promise<SeoContentPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const collections = await getDbCollections();
    const seoContentsCollection = collections.seoContentsCollection();

    if (!input) {
      return {
        success: false,
        message: await getApiMessage('seoContent.update.error'),
      };
    }

    const {
      content,
      titleI18n,
      metaDescriptionI18n,
      metaTitleI18n,
      companySlug,
      showForIndex,
      rubricSlug,
      slug,
      url,
    } = input;
    const _id = new ObjectId(input._id);
    const oldSeoContent = await seoContentsCollection.findOne({
      _id,
    });

    // check uniqueness
    await checkSeoContentUniqueness({
      companySlug,
      seoContentId: _id,
      text: content,
      oldText: oldSeoContent?.content,
    });

    // update
    const updatedSeoContentResult = await seoContentsCollection.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: {
          content,
          titleI18n,
          metaDescriptionI18n,
          metaTitleI18n,
          showForIndex,
          companySlug,
          rubricSlug,
          slug,
          url,
          seoLocales: oldSeoContent?.seoLocales || [],
        },
      },
      {
        upsert: true,
      },
    );
    if (!updatedSeoContentResult.ok) {
      return {
        success: false,
        message: await getApiMessage('seoContent.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('seoContent.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
