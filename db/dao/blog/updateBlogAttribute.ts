import { findDocumentByI18nField } from 'db/utils/findDocumentByI18nField';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import {
  getApiResolverValidationSchema,
  getOperationPermission,
  getRequestParams,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { updateBlogAttributeSchema } from 'validation/blogSchema';
import { COL_BLOG_ATTRIBUTES } from '../../collectionNames';
import { BlogAttributePayloadModel, TranslationModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';

export interface UpdateBlogAttributeInputInterface {
  blogAttributeId: string;
  nameI18n: TranslationModel;
  optionsGroupId?: string | null;
}

export async function updateBlogAttribute(req: NextApiRequest, res: NextApiResponse) {
  const collections = await getDbCollections();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogAttributesCollection = collections.blogAttributesCollection();
  const args = JSON.parse(req.body) as UpdateBlogAttributeInputInterface;

  let payload: BlogAttributePayloadModel = {
    success: false,
    message: await getApiMessage('blogAttributes.update.error'),
  };

  try {
    // check permission
    const { allow, message } = await getOperationPermission({
      context: {
        req,
        res,
      },
      slug: 'updateBlogAttribute',
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
      schema: updateBlogAttributeSchema,
    });
    await validationSchema.validate(args);

    // check if exist
    const exist = await findDocumentByI18nField({
      collectionName: COL_BLOG_ATTRIBUTES,
      fieldName: 'nameI18n',
      fieldArg: args.nameI18n,
      additionalQuery: {
        _id: {
          $ne: new ObjectId(args.blogAttributeId),
        },
      },
    });
    if (exist) {
      payload = {
        success: false,
        message: await getApiMessage('blogAttributes.update.duplicate'),
      };
      res.status(500).send(payload);
      return;
    }

    // update
    const { blogAttributeId, optionsGroupId, ...values } = args;
    if (!optionsGroupId) {
      payload = {
        success: false,
        message: await getApiMessage('blogAttributes.update.error'),
      };
      res.status(500).send(payload);
      return;
    }

    const updatedBlogAttributeResult = await blogAttributesCollection.findOneAndUpdate(
      {
        _id: new ObjectId(blogAttributeId),
      },
      {
        $set: {
          ...values,
          optionsGroupId: new ObjectId(optionsGroupId),
        },
      },
      {
        returnDocument: 'after',
      },
    );

    const updatedBlogAttribute = updatedBlogAttributeResult.value;
    if (!updatedBlogAttributeResult.ok || !updatedBlogAttribute) {
      payload = {
        success: false,
        message: await getApiMessage('blogAttributes.update.error'),
      };
      res.status(500).send(payload);
      return;
    }

    // success
    payload = {
      success: true,
      message: await getApiMessage('blogAttributes.update.success'),
      payload: updatedBlogAttribute,
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
