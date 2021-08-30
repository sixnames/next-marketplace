import { DEFAULT_LOCALE, SORT_ASC } from 'config/common';
import { COL_BLOG_ATTRIBUTES, COL_OPTIONS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { BlogAttributeInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getRequestParams } from 'lib/sessionHelpers';
import { NextApiRequest, NextApiResponse } from 'next';

export async function getBlogAttributes(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await getDatabase();
  const { locale } = await getRequestParams({ req, res });
  const blogAttributesCollection = db.collection<BlogAttributeInterface>(COL_BLOG_ATTRIBUTES);
  const initialBlogAttributesAggregation = await blogAttributesCollection
    .aggregate([
      {
        $sort: {
          [`nameI18n.${DEFAULT_LOCALE}`]: SORT_ASC,
        },
      },
      {
        $lookup: {
          as: 'options',
          from: COL_OPTIONS,
          let: {
            optionsGroupId: '$optionsGroupId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$optionsGroupId', '$$optionsGroupId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const attributes = initialBlogAttributesAggregation.map((attribute) => {
    const options = attribute.options
      ? attribute.options.map((option) => {
          return {
            ...option,
            name: getFieldStringLocale(option.nameI18n, locale),
          };
        })
      : null;
    const optionNames = (options || []).map(({ name }) => `${name}`);

    return {
      ...attribute,
      name: getFieldStringLocale(attribute.nameI18n, locale),
      options,
      readableValue: optionNames.join(', '),
    };
  });

  // response
  res.status(200).send(attributes);
  return;
}
