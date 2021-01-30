import { ObjectId } from 'mongodb';
import { getDatabase } from 'db/mongodb';
import { COL_RUBRICS } from 'db/collectionNames';

export const getRubricChildrenIds = async (rubricId: ObjectId): Promise<ObjectId[]> => {
  const db = await getDatabase();
  const rubricsCollection = db.collection(COL_RUBRICS);

  // get all nested rubrics ids
  const rubricChildrenIds = await rubricsCollection
    .aggregate([
      { $match: { parentId: rubricId } },
      {
        $graphLookup: {
          from: 'rubrics',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentId',
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

  return aggregationResult.allIds;
};

export const getRubricsTreeIds = async (rubricId: ObjectId): Promise<ObjectId[]> => {
  const childrenIds = await getRubricChildrenIds(rubricId);
  return [...childrenIds, rubricId];
};
