import { ASSETS_DIST_BLOG_CONTENT } from 'config/common';
import { COL_BLOG_POSTS } from 'db/collectionNames';
import { BlogPostModel, ConstructorAssetPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { deleteUpload, storeRestApiUploads } from 'lib/assetUtils/assetUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { parseApiFormData, UploadRestApiImageInterface } from 'lib/restApi';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export interface UpdateBlogPostPreviewFieldsInterface {
  blogPostId: string;
}

export interface UploadBlogPostAssetInputInterface
  extends UploadRestApiImageInterface,
    UpdateBlogPostPreviewFieldsInterface {}

export async function uploadPostAsset(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const formData = await parseApiFormData<UpdateBlogPostPreviewFieldsInterface>(req);

  let payload: ConstructorAssetPayloadModel = {
    success: false,
    message: await getApiMessage('blogPosts.create.error'),
    payload: '',
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
        payload: '',
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
        payload: '',
      };
      res.status(500).send(payload);
      return;
    }

    // delete old asset
    if (blogPost.previewImage) {
      await deleteUpload({ filePath: blogPost.previewImage });
    }

    // upload asset
    const uploadedAsset = await storeRestApiUploads({
      files: formData.files,
      itemId: blogPost.slug,
      dist: ASSETS_DIST_BLOG_CONTENT,
      startIndex: blogPost.assetKeys.length,
    });
    if (!uploadedAsset) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.error'),
        payload: '',
      };
      res.status(500).send(payload);
      return;
    }

    const asset = uploadedAsset[0];
    if (!asset) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.error'),
        payload: '',
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
        payload: '',
      };
      res.status(500).send(payload);
      return;
    }

    // success
    payload = {
      success: true,
      message: await getApiMessage('blogPosts.update.success'),
      payload: asset.url,
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