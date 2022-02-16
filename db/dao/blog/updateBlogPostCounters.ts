import { VIEWS_COUNTER_STEP } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { BlogPostPayloadModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateBlogPostCountersInputInterface {
  blogPostId: string;
  companySlug: string;
  sessionCity: string;
}

export async function updateBlogPostCounters({
  context,
  input,
}: DaoPropsInterface<UpdateBlogPostCountersInputInterface>): Promise<BlogPostPayloadModel> {
  try {
    const collections = await getDbCollections();
    const blogPostsCollection = collections.blogPostsCollection();
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
        message: await getApiMessage('blogPosts.update.error'),
      };
    }

    const { sessionCity, companySlug, blogPostId } = input;

    await blogPostsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(blogPostId),
      },
      {
        $inc: {
          [`views.${companySlug}.${sessionCity}`]: VIEWS_COUNTER_STEP,
        },
      },
    );

    return {
      success: true,
      message: await getApiMessage('blogPosts.update.success'),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
