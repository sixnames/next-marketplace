import { COL_BLOG_POSTS } from 'db/collectionNames';
import { BlogPostModel, BlogPostPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export interface DeleteBlogAttributeInputInterface {
  _id: string;
}

export async function deleteBlogPost(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const args = req.body as DeleteBlogAttributeInputInterface;

  let payload: BlogPostPayloadModel = {
    success: false,
    message: await getApiMessage('blogPosts.delete.error'),
  };

  try {
    // check permission
    const { allow, message } = await getOperationPermission({
      context: {
        req,
        res,
      },
      slug: 'deleteBlogPost',
    });
    if (!allow) {
      payload = {
        success: false,
        message: message,
      };
      res.status(500).send(payload);
      return;
    }

    // check if exist
    const _id = new ObjectId(args._id);
    const blogPost = await blogPostsCollection.findOne({ _id });
    if (!blogPost) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.delete.notFound'),
      };
      res.status(500).send(payload);
      return;
    }

    // delete
    const removedBlogPostResult = await blogPostsCollection.findOneAndDelete({ _id });
    if (!removedBlogPostResult.ok) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.delete.error'),
      };
      res.status(500).send(payload);
      return;
    }

    // success
    payload = {
      success: true,
      message: await getApiMessage('blogPosts.delete.success'),
    };

    // response
    res.status(200).send(payload);
    return;
  } catch (e) {
    res.status(200).send({
      success: true,
      message: getResolverErrorMessage(e),
    });
    return;
  }
}
