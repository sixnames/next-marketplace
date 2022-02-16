import { BlogPostPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { deleteUpload } from 'lib/assetUtils/assetUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export interface DeleteBlogPostPreviewImageInterface {
  blogPostId: string;
}

export async function deletePostPreviewImage(req: NextApiRequest, res: NextApiResponse) {
  const collections = await getDbCollections();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = collections.blogPostsCollection();
  const args = JSON.parse(req.body) as DeleteBlogPostPreviewImageInterface;

  let payload: BlogPostPayloadModel = {
    success: false,
    message: await getApiMessage('blogPosts.create.error'),
  };

  if (!args.blogPostId) {
    res.status(500).send(payload);
    return;
  }

  try {
    // check permission
    const { allow, message } = await getOperationPermission({
      context: {
        req,
        res,
      },
      slug: 'updateBlogPost',
    });
    if (!allow) {
      payload = {
        success: false,
        message: message,
      };
      res.status(500).send(payload);
      return;
    }

    // check availability
    const blogPostId = new ObjectId(`${args.blogPostId}`);
    const blogPost = await blogPostsCollection.findOne({
      _id: blogPostId,
    });
    if (!blogPost) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.notFound'),
      };
      res.status(500).send(payload);
      return;
    }

    // update
    const updatedPostResult = await blogPostsCollection.findOneAndUpdate(
      { _id: blogPostId },
      {
        $set: {
          previewImage: null,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedPost = updatedPostResult.value;
    if (!updatedPostResult.ok || !updatedPost) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.error'),
      };
      res.status(500).send(payload);
      return;
    }

    // delete old asset
    if (blogPost.previewImage) {
      await deleteUpload(blogPost.previewImage);
    }

    // success
    payload = {
      success: true,
      message: await getApiMessage('blogPosts.update.success'),
      payload: updatedPost,
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
