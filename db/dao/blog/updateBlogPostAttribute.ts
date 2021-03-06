import { FILTER_SEPARATOR } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { noNaN } from 'lib/numbers';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { COL_OPTIONS } from '../../collectionNames';
import { BlogPostPayloadModel, OptionModel } from '../../dbModels';
import { getDbCollections } from '../../mongodb';

export interface UpdateBlogPostAttributeInterface {
  blogPostId: string;
  blogAttributeId: string;
  selectedOptionsIds: string[];
}

export async function updateBlogPostAttribute(req: NextApiRequest, res: NextApiResponse) {
  const collections = await getDbCollections();
  const { getApiMessage } = await getRequestParams({ req, res });

  const blogAttributesCollection = collections.blogAttributesCollection();
  const blogPostsCollection = collections.blogPostsCollection();
  const optionsCollection = collections.optionsCollection();

  let payload: BlogPostPayloadModel = {
    success: false,
    message: await getApiMessage('blogPosts.update.error'),
  };

  try {
    const args = JSON.parse(req.body) as UpdateBlogPostAttributeInterface;

    const blogPostId = new ObjectId(args.blogPostId);
    const blogAttributeId = new ObjectId(args.blogAttributeId);
    const selectedOptionsIds = args.selectedOptionsIds.map((_id) => new ObjectId(_id));

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

    // post
    const post = await blogPostsCollection.findOne({
      _id: blogPostId,
    });
    if (!post) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.notFound'),
      };
      res.status(500).send(payload);
      return;
    }

    // attribute
    const attribute = await blogAttributesCollection.findOne({
      _id: blogAttributeId,
    });
    if (!attribute) {
      payload = {
        success: false,
        message: await getApiMessage('blogPosts.update.error'),
      };
      res.status(500).send(payload);
      return;
    }

    // get options
    const finalOptions: OptionModel[] = [];
    if (selectedOptionsIds.length > 0) {
      const optionsAggregation = await optionsCollection
        .aggregate<OptionModel>([
          {
            $match: {
              _id: {
                $in: selectedOptionsIds,
              },
            },
          },
          {
            $graphLookup: {
              from: COL_OPTIONS,
              as: 'options',
              startWith: '$parentId',
              connectFromField: 'parentId',
              connectToField: '_id',
              depthField: 'level',
            },
          },
        ])
        .toArray();

      // sort parent options in descendant order for each selected option
      optionsAggregation.forEach((selectedOptionTree) => {
        const { options, ...restOption } = selectedOptionTree;

        const sortedOptions = (options || []).sort((a, b) => {
          return noNaN(b.level) - noNaN(a.level);
        });

        const treeQueue = [...sortedOptions, restOption];
        treeQueue.forEach((finalOption) => {
          finalOptions.push(finalOption);
        });
      });
    }
    const finalFilterSlugs = finalOptions.map(
      ({ slug }) => `${attribute.slug}${FILTER_SEPARATOR}${slug}`,
    );

    // update
    const attributeSlug = attribute.slug;
    const otherAttributesOptions = post.filterSlugs.filter((slug) => {
      const slugParts = slug.split(FILTER_SEPARATOR);
      return slugParts[0] !== attributeSlug;
    });
    const updatedBlogPostResult = await blogPostsCollection.findOneAndUpdate(
      { _id: blogPostId },
      {
        $set: {
          filterSlugs: [...otherAttributesOptions, ...finalFilterSlugs],
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
