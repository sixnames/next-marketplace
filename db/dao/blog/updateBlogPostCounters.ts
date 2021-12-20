import { ObjectId } from 'mongodb';
import { VIEWS_COUNTER_STEP } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getRequestParams, getSessionRole } from '../../../lib/sessionHelpers';
import { COL_BLOG_POSTS } from '../../collectionNames';
import { BlogPostPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { BlogPostInterface, DaoPropsInterface } from '../../uiInterfaces';

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
    const { db } = await getDatabase();
    const blogPostsCollection = db.collection<BlogPostInterface>(COL_BLOG_POSTS);
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
