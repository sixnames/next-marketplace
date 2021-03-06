import { deleteUpload, storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_BLOG } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { parseApiFormData, UploadRestApiImageInterface } from 'lib/restApi';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { BlogPostPayloadModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';

export interface UpdateBlogPostPreviewFieldsInterface {
  blogPostId: string;
}

export interface UpdateBlogPostPreviewInputInterface
  extends UploadRestApiImageInterface,
    UpdateBlogPostPreviewFieldsInterface {}

export async function updatePostPreviewImage(req: NextApiRequest, res: NextApiResponse) {
  const collections = await getDbCollections();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = collections.blogPostsCollection();
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
          assetKeys: asset,
        },
        $set: {
          previewImage: asset,
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
