import { FILTER_SEPARATOR } from 'config/common';
import { COL_OPTIONS } from 'db/collectionNames';
import { OptionAlphabetListModel, OptionModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { OptionInterface } from 'db/uiInterfaces';
import { getAlphabetList, getTreeFromList } from 'lib/optionUtils';
import { arg, extendType, inputObjectType, nonNull, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';

export const Option = objectType({
  name: 'Option',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.string('color');
    t.string('image');
    t.nonNull.json('variants');
    t.field('gender', {
      type: 'Gender',
    });
    t.list.nonNull.field('options', {
      type: 'Option',
      resolve: async (source): Promise<OptionModel[]> => {
        const { db } = await getDatabase();
        const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
        const options = await optionsCollection.find({ parentId: source._id }).toArray();
        return options;
      },
    });

    // Option name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });
  },
});

export const OptionAlphabetInput = inputObjectType({
  name: 'OptionAlphabetInput',
  definition(t) {
    t.nonNull.objectId('optionsGroupId');
    t.objectId('parentId');
    t.list.nonNull.string('slugs');
  },
});

export const OptionsAlphabetList = objectType({
  name: 'OptionsAlphabetList',
  definition(t) {
    t.implements('AlphabetList');
    t.nonNull.list.nonNull.field('docs', {
      type: 'Option',
    });
  },
});

export const OptionQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return options grouped by alphabet
    t.nonNull.list.nonNull.field('getOptionAlphabetLists', {
      type: 'OptionsAlphabetList',
      description: 'Should return options grouped by alphabet',
      args: {
        input: nonNull(
          arg({
            type: 'OptionAlphabetInput',
          }),
        ),
      },
      resolve: async (_root, args, context): Promise<OptionAlphabetListModel[]> => {
        const { db } = await getDatabase();
        const { locale } = await getRequestParams(context);
        const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
        const { input } = args;
        const { optionsGroupId, slugs, parentId } = input;

        const query: Record<string, any> = {
          optionsGroupId,
        };

        // Check if slugs arg exist
        if (slugs && slugs.length > 0) {
          const realSlugs: string[] = [];
          slugs.forEach((slug) => {
            const slugArray = slug.split(FILTER_SEPARATOR);
            const realSlug = slugArray[1] || slug;
            realSlugs.push(realSlug);
          });

          query.slug = {
            $in: realSlugs,
          };
        }

        // Check if parentId arg exist
        if (parentId) {
          query.parentId = parentId;
        }

        const options = await optionsCollection
          .aggregate<OptionInterface>([
            {
              $match: query,
            },
          ])
          .toArray();

        const optionsTree = getTreeFromList<OptionInterface>({
          list: options,
          parentId,
          childrenFieldName: 'options',
          locale,
        });

        return getAlphabetList<OptionModel>({
          entityList: optionsTree,
          locale,
        });
      },
    });
  },
});
