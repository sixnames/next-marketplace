import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ASSETS_DIST_BLOG } from '../../../config/common';
import { deleteUpload, storeUploads } from '../../../lib/assetUtils/assetUtils';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { parseApiFormData, UploadRestApiImageInterface } from '../../../lib/restApi';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_BLOG_POSTS } from '../../collectionNames';
import { BlogPostModel, BlogPostPayloadModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';

export interface UpdateBlogPostPreviewFieldsInterface {
  blogPostId: string;
}

export interface UpdateBlogPostPreviewInputInterface
  extends UploadRestApiImageInterface,
    UpdateBlogPostPreviewFieldsInterface {}

export async function updatePostPreviewImage(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const formData = await parseApiFormData<UpdateBlogPostPreviewFieldsInterface>(req);

  let payload: BlogPostPayloadModel = {
    success: false,
    message: await getApiMessage('blogPosts.create.error'),
  };

  if (!formData || !formData.files || !formData.fields) {
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
    const { fields } = formData;
    const blogPostId = new ObjectId(`${fields.blogPostId}`);
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

    // delete old asset
    if (blogPost.previewImage) {
      await deleteUpload(blogPost.previewImage);
    }

    // upload asset
    const uploadedAsset = await storeUploads({
      files: formData.files,
      dirName: blogPost.slug,
      dist: ASSETS_DIST_BLOG,
      startIndex: 0,
    });
    if (!uploadedAsset) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.error'),
      };
      res.status(500).send(payload);
      return;
    }

    const asset = uploadedAsset[0];
    if (!asset) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.error'),
      };
      res.status(500).send(payload);
      return;
    }

    // update
    const updatedPostResult = await blogPostsCollection.findOneAndUpdate(
      { _id: blogPostId },
      {
        $addToSet: {
          assetKeys: asset.url,
        },
        $set: {
          previewImage: asset.url,
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
