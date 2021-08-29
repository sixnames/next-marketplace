import { COL_BLOG_ATTRIBUTES } from 'db/collectionNames';
import { BlogAttributeModel, BlogAttributePayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export interface DeleteBlogAttributeInputInterface {
  _id: string;
}

export async function deleteBlogAttribute(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { getApiMessage } = await getRequestParams({ req, res });
  const blogAttributesCollection = db.collection<BlogAttributeModel>(COL_BLOG_ATTRIBUTES);
  const args = req.body as DeleteBlogAttributeInputInterface;

  let payload: BlogAttributePayloadModel = {
    success: false,
    message: await getApiMessage('blogAttributes.delete.error'),
  };

  try {
    // check permission
    const { allow, message } = await getOperationPermission({
      context: {
        req,
        res,
      },
      slug: 'deleteBlogAttribute',
    });
    if (!allow) {
      payload = {
        success: false,
        message: message,
      };
      res.status(500).send(payload);
      return;
    }

    // check if exist
    const _id = new ObjectId(args._id);
    const blogAttribute = await blogAttributesCollection.findOne({ _id });
    if (!blogAttribute) {
      payload = {
        success: false,
        message: await getApiMessage('blogAttributes.delete.notFound'),
      };
      res.status(500).send(payload);
      return;
    }

    // delete
    const removedBlogAttributeResult = await blogAttributesCollection.findOneAndDelete({
      _id,
    });
    if (!removedBlogAttributeResult.ok) {
      payload = {
        success: false,
        message: await getApiMessage('blogAttributes.delete.error'),
      };
      res.status(500).send(payload);
      return;
    }

    // success
    payload = {
      success: true,
      message: await getApiMessage('blogAttributes.delete.success'),
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
