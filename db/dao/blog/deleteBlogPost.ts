import { BlogPostPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { deleteUpload } from 'lib/assetUtils/assetUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export interface DeleteBlogPostInputInterface {
  _id: string;
}

export async function deleteBlogPost(req: NextApiRequest, res: NextApiResponse) {
  const collections = await getDbCollections();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = collections.blogPostsCollection();
  const args = JSON.parse(req.body) as DeleteBlogPostInputInterface;

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

    // delete assets
    for await (const filePath of blogPost.assetKeys) {
      await deleteUpload(filePath);
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
      success: false,
      message: getResolverErrorMessage(e),
    });
    return;
  }
}
