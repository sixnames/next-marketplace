import {
  DEFAULT_COUNTERS_OBJECT,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
  PAGE_STATE_PUBLISHED,
} from 'config/common';
import { COL_BLOG_POSTS } from 'db/collectionNames';
import { BlogPostModel, BlogPostPayloadModel, TranslationModel } from 'db/dbModels';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getApiResolverValidationSchema,
  getOperationPermission,
  getRequestParams,
} from 'lib/sessionHelpers';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { createBlogPostSchema } from 'validation/blogSchema';

export interface CreateBlogAttributeInputInterface {
  titleI18n: TranslationModel;
  descriptionI18n: TranslationModel;
  companySlug: string;
}

export async function createBlogPost(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const args = req.body as CreateBlogAttributeInputInterface;

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
    const slug = generateDefaultLangSlug(args.titleI18n);
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
    const createdBlogPost = createdBlogPostResult.ops[0];
    if (!createdBlogPostResult.result.ok || !createdBlogPost) {
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
      success: true,
      message: getResolverErrorMessage(e),
    });
    return;
  }
}
