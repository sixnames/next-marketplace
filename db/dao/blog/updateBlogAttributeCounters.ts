import { DEFAULT_LOCALE, FILTER_SEPARATOR, VIEWS_COUNTER_STEP } from 'config/common';
import { COL_BLOG_ATTRIBUTES, COL_OPTIONS } from 'db/collectionNames';
import { getPageSessionUser } from 'db/dao/user/getPageSessionUser';
import { BlogAttributeModel, BlogAttributePayloadModel, OptionModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams } from 'lib/sessionHelpers';

export interface UpdateBlogAttributeCountersInputInterface {
  filters: string[];
  companySlug: string;
  sessionCity: string;
}

export async function updateBlogAttributeCounters({
  input,
  context,
}: DaoPropsInterface<UpdateBlogAttributeCountersInputInterface>): Promise<BlogAttributePayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);

    if (!input) {
      return {
        success: false,
        message: await getApiMessage('blogAttributes.update.error'),
      };
    }

    const { db } = await getDatabase();
    const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
    const blogAttributesCollection = db.collection<BlogAttributeModel>(COL_BLOG_ATTRIBUTES);

    const sessionUser = await getPageSessionUser({
      context,
      locale: DEFAULT_LOCALE,
    });

    const { companySlug, sessionCity, filters } = input;
    const selectedAttributesSlugs: string[] = [];
    const selectedOptionsSlugs: string[] = [];
    filters.forEach((filter) => {
      const filterParts = filter.split(FILTER_SEPARATOR);
      const attributeSlug = filterParts[0];
      const optionSlug = filterParts[1];

      if (attributeSlug) {
        selectedAttributesSlugs.push(attributeSlug);
      }

      if (optionSlug) {
        selectedOptionsSlugs.push(optionSlug);
      }
    });

    if (!sessionUser?.me.role?.isStaff) {
      const counterUpdater = {
        $inc: {
          [`views.${companySlug}.${sessionCity}`]: VIEWS_COUNTER_STEP,
        },
      };

      // options
      if (selectedOptionsSlugs.length > 0) {
        await optionsCollection.updateMany(
          {
            slug: {
              $in: selectedOptionsSlugs,
            },
          },
          counterUpdater,
        );
      }

      // attributes
      if (selectedAttributesSlugs.length > 0) {
        await blogAttributesCollection.updateMany(
          {
            slug: {
              $in: selectedAttributesSlugs,
            },
          },
          counterUpdater,
        );
      }
    }

    return {
      success: true,
      message: await getApiMessage('blogAttributes.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
