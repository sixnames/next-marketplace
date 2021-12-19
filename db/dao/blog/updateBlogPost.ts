import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import {
  getApiResolverValidationSchema,
  getOperationPermission,
  getRequestParams,
} from '../../../lib/sessionHelpers';
import { updateBlogPostSchema } from '../../../validation/blogSchema';
import { COL_BLOG_POSTS } from '../../collectionNames';
import {
  BlogPostModel,
  BlogPostPayloadModel,
  PageStateModel,
  TranslationModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { findDocumentByI18nField } from '../findDocumentByI18nField';

export interface UpdateBlogPostInputInterface {
  blogPostId: string;
  titleI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  state: PageStateModel;
  source?: string;
  content: string;
}

export async function updateBlogPost(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const args = JSON.parse(req.body) as UpdateBlogPostInputInterface;

  let payload: BlogPostPayloadModel = {
    success: false,
    message: await getApiMessage('blogPosts.update.error'),
  };

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

    // validate
    const validationSchema = await getApiResolverValidationSchema({
      req,
      res,
      schema: updateBlogPostSchema,
    });
    await validationSchema.validate(args);

    // check if exist
    const { blogPostId, ...values } = args;
    const _id = new ObjectId(blogPostId);
    const exist = await findDocumentByI18nField({
      collectionName: COL_BLOG_POSTS,
      fieldName: 'titleI18n',
      fieldArg: args.titleI18n,
      additionalQuery: {
        _id: {
          $ne: _id,
        },
      },
    });
    if (exist) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.duplicate'),
      };
      res.status(500).send(payload);
      return;
    }

    // update
    const updatedBlogPostResult = await blogPostsCollection.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...values,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );
    const updatedBlogPost = updatedBlogPostResult.value;
    if (!updatedBlogPostResult.ok || !updatedBlogPost) {
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
      payload: updatedBlogPost,
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
