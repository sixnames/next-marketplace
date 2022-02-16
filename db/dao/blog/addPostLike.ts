import { BlogPostPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getRequestParams, getSessionUser } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { UpdateBlogPostInputInterface } from './updateBlogPost';

export interface AddBlogPostLikeInputInterface {
  blogPostId: string;
}

export async function addPostLike(req: NextApiRequest, res: NextApiResponse) {
  const collections = await getDbCollections();
  const { getApiMessage } = await getRequestParams({ req, res });
  const sessionUser = await getSessionUser({ req, res });
  const blogPostsCollection = collections.blogPostsCollection();
  const blogLikesCollection = collections.blogLikesCollection();
  const args = JSON.parse(req.body) as UpdateBlogPostInputInterface;

  let payload: BlogPostPayloadModel = {
    success: false,
    message: await getApiMessage('blogPosts.update.error'),
  };

  if (!sessionUser) {
    res.status(200).send(payload);
    return;
  }

  try {
    const { blogPostId } = args;

    // check availability
    const _id = new ObjectId(blogPostId);
    const post = await blogPostsCollection.findOne({
      _id,
    });
    if (!post) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.notFound'),
      };
      res.status(200).send(payload);
      return;
    }

    // check existing
    const exist = await blogLikesCollection.findOne({
      blogPostId: post._id,
      userId: sessionUser._id,
    });
    if (exist) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.error'),
      };
      res.status(200).send(payload);
      return;
    }

    // create
    const createdBlogLike = await blogLikesCollection.insertOne({
      _id: new ObjectId(),
      blogPostId: post._id,
      userId: sessionUser._id,
    });
    if (!createdBlogLike.acknowledged) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.error'),
      };
      res.status(200).send(payload);
      return;
    }

    // success
    payload = {
      success: true,
      message: await getApiMessage('blogPosts.update.success'),
      payload: post,
    };

    // response
    res.status(200).send(payload);
    return;
  } catch (e) {
    res.status(200).send({
      success: false,
      message: getResolverErrorMessage(e),
    });
    return;
  }
}
