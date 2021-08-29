import { ASSETS_DIST_BLOG } from 'config/common';
import { COL_BLOG_POSTS } from 'db/collectionNames';
import { BlogPostModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getApiMessageValue } from 'lib/apiMessageUtils';
import { deleteUpload, storeRestApiUploads } from 'lib/assetUtils/assetUtils';
import { parseApiFormData } from 'lib/restApi';
import { getOperationPermission } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface UpdateBlogPostPreviewImageInterface {
  postId: string;
}
// TODO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Permission
  const { allow, message } = await getOperationPermission({
    context: {
      req,
      res,
    },
    slug: 'updatePage',
  });
  if (!allow) {
    res.status(500).send({
      success: false,
      message: message,
    });
    return;
  }

  const formData = await parseApiFormData<UpdateBlogPostPreviewImageInterface>(req);
  const { locale } = req.cookies;

  if (!formData || !formData.files || !formData.fields) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'blogPosts.update.error',
        locale,
      }),
    });
    return;
  }

  const { fields } = formData;
  const postId = new ObjectId(`${fields.postId}`);

  const { db } = await getDatabase();
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);

  // check availability
  const post = await blogPostsCollection.findOne({ _id: postId });
  if (!post) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'blogPosts.update.notFound',
        locale,
      }),
    });
    return;
  }

  // delete old asset
  if (post.previewImage) {
    await deleteUpload({ filePath: post.previewImage });
  }

  // upload asset
  const uploadedAsset = await storeRestApiUploads({
    files: formData.files,
    itemId: post.slug,
    dist: ASSETS_DIST_BLOG,
    startIndex: 0,
  });
  if (!uploadedAsset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'blogPosts.update.error',
        locale,
      }),
    });
    return;
  }

  const asset = uploadedAsset[0];
  if (!asset) {
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'blogPosts.update.error',
        locale,
      }),
    });
    return;
  }

  // update
  const updatedPostResult = await blogPostsCollection.findOneAndUpdate(
    { _id: post._id },
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
    res.status(500).send({
      success: false,
      message: await getApiMessageValue({
        slug: 'blogPosts.update.error',
        locale,
      }),
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: await getApiMessageValue({
      slug: 'blogPosts.update.success',
      locale,
    }),
  });
};
