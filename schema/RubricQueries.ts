import { arg, extendType, inputObjectType, nonNull, stringArg } from 'nexus';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_RUBRICS } from 'db/collectionNames';
import { RUBRIC_LEVEL_ONE, SORT_ASC, SORT_DESC } from 'config/common';
import { getRequestParams } from 'lib/sessionHelpers';

export const GetRubricsTreeInput = inputObjectType({
  name: 'GetRubricsTreeInput',
  definition(t) {
    t.list.nonNull.field('excludedRubricsIds', {
      type: 'ObjectId',
    });
  },
});

export const RubricQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return rubric by given id
    t.nonNull.field('getRubric', {
      type: 'Rubric',
      description: 'Should return rubric by given id',
      args: {
        _id: nonNull(
          arg({
            type: 'ObjectId',
          }),
        ),
      },
      resolve: async (_root, args): Promise<RubricModel> => {
        const db = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const rubric = await rubricsCollection.findOne({ _id: args._id });
        if (!rubric) {
          throw Error('Rubric not fond by given id');
        }
        return rubric;
      },
    });

    // Should return rubric by given slug
    t.nonNull.field('getRubricBySlug', {
      type: 'Rubric',
      description: 'Should return rubric by given slug',
      args: {
        slug: nonNull(stringArg()),
      },
      resolve: async (_root, args): Promise<RubricModel> => {
        const db = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const rubric = await rubricsCollection.findOne({ slug: args.slug });
        if (!rubric) {
          throw Error('Rubric not fond by given slug');
        }
        return rubric;
      },
    });

    // Should return rubrics tree
    t.nonNull.list.nonNull.field('getRubricsTree', {
      type: 'Rubric',
      args: {
        input: arg({
          type: 'GetRubricsTreeInput',
          default: {},
        }),
      },
      description: 'Should return rubrics tree',
      resolve: async (_root, args): Promise<RubricModel[]> => {
        const db = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
        const { input } = args;
        const excludedIds = input?.excludedRubricsIds || [];

        const levelOneRubrics = await rubricsCollection
          .find(
            { level: RUBRIC_LEVEL_ONE, _id: { $nin: excludedIds } },
            { sort: { itemId: SORT_ASC } },
          )
          .toArray();

        return levelOneRubrics;
      },
    });

    // Should return catalogue nav rubrics tree
    t.nonNull.list.nonNull.field('getCatalogueNavRubrics', {
      type: 'Rubric',
      description: 'Should return catalogue nav rubrics tree',
      resolve: async (_root, _args, context): Promise<RubricModel[]> => {
        const { city } = await getRequestParams(context);
        const db = await getDatabase();
        const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

        const levelOneRubrics = await rubricsCollection
          .aggregate([
            { $match: { level: RUBRIC_LEVEL_ONE } },
            { $sort: { [`views.${city}`]: SORT_DESC, [`priority.${city}`]: SORT_DESC } },
          ])
          .toArray();

        return levelOneRubrics;
      },
    });
  },
});