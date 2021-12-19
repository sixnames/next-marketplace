import { NextApiRequest, NextApiResponse } from 'next';
import {
  DEFAULT_COUNTERS_OBJECT,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  PAGE_STATE_PUBLISHED,
} from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getNextNumberItemId } from '../../../lib/itemIdUtils';
import {
  getApiResolverValidationSchema,
  getOperationPermission,
  getRequestParams,
} from '../../../lib/sessionHelpers';
import { createBlogPostSchema } from '../../../validation/blogSchema';
import { COL_BLOG_POSTS } from '../../collectionNames';
import { BlogPostModel, BlogPostPayloadModel, TranslationModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { findDocumentByI18nField } from '../findDocumentByI18nField';

export interface CreateBlogPostInputInterface {
  titleI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  companySlug: string;
}

export async function createBlogPost(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const args = JSON.parse(req.body) as CreateBlogPostInputInterface;

  let payload: BlogPostPayloadModel = {
    success: false,
    message: await getApiMessage('blogPosts.create.error'),
  };

  try {
    // check permission
    const { allow, message, user } = await getOperationPermission({
      context: {
        req,
        res,
      },
      slug: 'createBlogPost',
    });

    if (!allow || !user) {
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
      schema: createBlogPostSchema,
    });
    await validationSchema.validate(args);

    // check if exist
    const exist = await findDocumentByI18nField({
      collectionName: COL_BLOG_POSTS,
      fieldName: 'titleI18n',
      fieldArg: args.titleI18n,
      additionalQuery: {
        companySlug: args.companySlug,
      },
    });
    if (exist) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.create.duplicate'),
      };
      res.status(500).send(payload);
      return;
    }

    // create
    const slug = await getNextNumberItemId(COL_BLOG_POSTS);
    const createdBlogPostResult = await blogPostsCollection.insertOne({
      ...args,
      slug,
      state: PAGE_STATE_PUBLISHED,
      assetKeys: [],
      selectedOptionsSlugs: [],
      authorId: user._id,
      content: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...DEFAULT_COUNTERS_OBJECT,
    });
    const createdBlogPost = await blogPostsCollection.findOne({
      _id: createdBlogPostResult.insertedId,
    });
    if (!createdBlogPostResult.acknowledged || !createdBlogPost) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.create.error'),
      };
      res.status(500).send(payload);
      return;
    }

    // success
    payload = {
      success: true,
      message: await getApiMessage('blogPosts.create.success'),
      payload: createdBlogPost,
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
