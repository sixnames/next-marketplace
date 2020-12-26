import { ProductModel } from '../entities/Product';
import { Query } from 'mongoose';
import { mongoose } from '@typegoose/typegoose';

export const getRubricChildrenIds = async (
  rubricId: string | mongoose.Types.ObjectId,
): Promise<string[]> => {
  // get all nested rubrics ids
  const rubricChildrenIds = await mongoose.connection.db
    .collection('rubrics')
    .aggregate([
      { $match: { parent: new mongoose.Types.ObjectId(rubricId) } },
      {
        $graphLookup: {
          from: 'rubrics',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent',
          as: 'children',
        },
      },
      {
        $project: {
          _id: 1,
          childrenIds: '$children._id',
        },
      },
      { $addFields: { allIds: { $concatArrays: ['$childrenIds', ['$_id']] } } },
      {
        $group: {
          _id: null,
          allIds: { $push: '$allIds' },
        },
      },
      {
        $project: {
          _id: 0,
          allIds: {
            $reduce: {
              input: '$allIds',
              initialValue: [],
              in: {
                $concatArrays: ['$$this', '$$value'],
              },
            },
          },
        },
      },
    ])
    .toArray();

  const aggregationResult = rubricChildrenIds[0];
  if (!aggregationResult) {
    return [];
  }

  return aggregationResult.allIds.map((id: mongoose.Types.ObjectId) => {
    return id.toString();
  });
};

export const getRubricsTreeIds = async (
  rubricId: string | mongoose.Types.ObjectId,
): Promise<string[]> => {
  const childrenIds = await getRubricChildrenIds(rubricId);
  return [...childrenIds, rubricId.toString()];
};

interface GetRubricCountersInterface {
  rubricId: string | mongoose.Types.ObjectId;
  args?: { [key: string]: any };
}

export const getRubricCounters = async ({
  rubricId,
  args = {},
}: GetRubricCountersInterface): Promise<Query<number>> => {
  const rubricsIds = await getRubricsTreeIds(rubricId);
  const query = ProductModel.getProductsFilter({ ...args, rubric: rubricsIds });

  return ProductModel.countDocuments({
    ...query,
  });
};
