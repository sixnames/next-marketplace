import { FILTER_PAGE_KEY, FILTER_SEPARATOR, VIEWS_COUNTER_STEP } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { BlogAttributePayloadModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

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
    const { role } = await getSessionRole(context);

    if (role?.isStaff) {
      return {
        success: true,
        message: await getApiMessage('blogAttributes.update.success'),
      };
    }

    if (!input) {
      return {
        success: false,
        message: await getApiMessage('blogAttributes.update.error'),
      };
    }

    const collections = await getDbCollections();
    const optionsCollection = collections.optionsCollection();
    const blogAttributesCollection = collections.blogAttributesCollection();

    const { companySlug, sessionCity, filters } = input;
    const selectedAttributesSlugs: string[] = [];
    const filterSlugs: string[] = [];
    filters.forEach((filter) => {
      const filterParts = filter.split(FILTER_SEPARATOR);
      const attributeSlug = filterParts[0];
      const optionSlug = filterParts[1];

      if (attributeSlug === FILTER_PAGE_KEY) {
        return;
      }

      if (attributeSlug) {
        selectedAttributesSlugs.push(attributeSlug);
      }

      if (optionSlug) {
        filterSlugs.push(optionSlug);
      }
    });

    const counterUpdater = {
      $inc: {
        [`views.${companySlug}.${sessionCity}`]: VIEWS_COUNTER_STEP,
      },
    };

    // options
    if (filterSlugs.length > 0) {
      await optionsCollection.updateMany(
        {
          slug: {
            $in: filterSlugs,
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
