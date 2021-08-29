import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { COL_BLOG_ATTRIBUTES } from 'db/collectionNames';
import { BlogAttributeModel, BlogAttributePayloadModel, TranslationModel } from 'db/dbModels';
import { findDocumentByI18nField } from 'db/dao/findDocumentByI18nField';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getApiResolverValidationSchema,
  getOperationPermission,
  getRequestParams,
} from 'lib/sessionHelpers';
import { generateDefaultLangSlug } from 'lib/slugUtils';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { createBlogAttributeSchema } from 'validation/blogSchema';

export interface CreateBlogAttributeInputInterface {
  nameI18n: TranslationModel;
  optionsGroupId: string;
}

export async function createBlogAttribute(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogAttributesCollection = db.collection<BlogAttributeModel>(COL_BLOG_ATTRIBUTES);
  const args = req.body as CreateBlogAttributeInputInterface;

  let payload: BlogAttributePayloadModel = {
    success: false,
    message: await getApiMessage('blogAttributes.create.error'),
  };

  try {
    // check permission
    const { allow, message } = await getOperationPermission({
      context: {
        req,
        res,
      },
      slug: 'createBlogAttribute',
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
      schema: createBlogAttributeSchema,
    });
    await validationSchema.validate(args);

    // check if exist
    const exist = await findDocumentByI18nField({
      collectionName: COL_BLOG_ATTRIBUTES,
      fieldName: 'nameI18n',
      fieldArg: args.nameI18n,
    });
    if (exist) {
      payload = {
        success: false,
        message: await getApiMessage('blogAttributes.create.duplicate'),
      };
      res.status(500).send(payload);
      return;
    }

    // create
    const slug = generateDefaultLangSlug(args.nameI18n);
    const createdBlogAttributeResult = await blogAttributesCollection.insertOne({
      ...args,
      slug,
      optionsGroupId: new ObjectId(args.optionsGroupId),
      ...DEFAULT_COUNTERS_OBJECT,
    });
    const createdBlogAttribute = createdBlogAttributeResult.ops[0];
    if (!createdBlogAttributeResult.result.ok || !createdBlogAttribute) {
      payload = {
        success: false,
        message: await getApiMessage('blogAttributes.create.error'),
      };
      res.status(500).send(payload);
      return;
    }

    // success
    payload = {
      success: true,
      message: await getApiMessage('blogAttributes.create.success'),
      payload: createdBlogAttribute,
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
