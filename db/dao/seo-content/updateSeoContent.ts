import { ObjectId } from 'mongodb';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { checkSeoContentUniqueness } from '../../../lib/seoContentUtils';
import { getRequestParams } from '../../../lib/sessionHelpers';
import { COL_SEO_CONTENTS } from '../../collectionNames';
import { SeoContentModel, SeoContentPayloadModel, TranslationModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateSeoContentInputInterface {
  seoContentId: string;
  content: string;
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
    const { db } = await getDatabase();
    const seoContentsCollection = db.collection<SeoContentModel>(COL_SEO_CONTENTS);

    if (!input) {
      return {
        success: false,
        message: await getApiMessage('seoContent.update.error'),
      };
    }

    const { content, titleI18n, metaDescriptionI18n, metaTitleI18n, companySlug, showForIndex } =
      input;
    const seoContentId = new ObjectId(input.seoContentId);
    const oldSeoContent = await seoContentsCollection.findOne({
      _id: seoContentId,
    });

    // check uniqueness
    await checkSeoContentUniqueness({
      companySlug,
      seoContentId: new ObjectId(seoContentId),
      text: content,
      oldText: oldSeoContent?.content,
    });

    // update
    const updatedSeoContentResult = await seoContentsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(seoContentId),
      },
      {
        $set: {
          content,
          titleI18n,
          metaDescriptionI18n,
          metaTitleI18n,
          showForIndex,
        },
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
