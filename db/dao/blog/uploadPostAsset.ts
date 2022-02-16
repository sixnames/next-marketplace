import { ConstructorAssetPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { storeUploads } from 'lib/assetUtils/assetUtils';
import { ASSETS_DIST_BLOG_CONTENT } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { parseApiFormData } from 'lib/restApi';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export interface UpdateBlogPostFieldsInterface {
  blogPostId: string;
}

export async function uploadPostAsset(req: NextApiRequest, res: NextApiResponse) {
  const collections = await getDbCollections();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = collections.blogPostsCollection();
  const formData = await parseApiFormData<UpdateBlogPostFieldsInterface>(req);

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

    // upload asset
    const uploadedAsset = await storeUploads({
      files: formData.files,
      dirName: blogPost.slug,
      dist: ASSETS_DIST_BLOG_CONTENT,
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
        $push: {
          assetKeys: asset,
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
      payload: asset,
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
