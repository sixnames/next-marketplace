import { enumType, objectType } from 'nexus';
import { getRequestParams } from 'lib/sessionHelpers';
import {
  ATTRIBUTE_VARIANTS_ENUMS,
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
} from 'config/common';
import { MetricModel, OptionModel, OptionsGroupModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_METRICS, COL_OPTIONS, COL_OPTIONS_GROUPS } from 'db/collectionNames';

export const AttributeVariant = enumType({
  name: 'AttributeVariant',
  members: ATTRIBUTE_VARIANTS_ENUMS,
  description: 'Attribute variant enum.',
});

export const AttributePositionInTitle = enumType({
  name: 'AttributePositionInTitle',
  members: ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  description: 'Attribute position in catalogue title enum.',
});

export const AttributeViewVariant = enumType({
  name: 'AttributeViewVariant',
  members: ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  description: 'Attribute view in product card variant enum.',
});

export const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.string('slug');
    t.objectId('optionsGroupId');
    t.nonNull.list.nonNull.objectId('optionsIds');
    t.objectId('metricId');
    t.json('positioningInTitle');
    t.nonNull.json('views');
    t.nonNull.json('priorities');
    t.nonNull.field('variant', {
      type: 'AttributeVariant',
    });
    t.nonNull.field('viewVariant', {
      type: 'AttributeViewVariant',
    });

    // Attribute name translation field resolver
    t.nonNull.field('name', {
      type: 'String',
      resolve: async (source, _args, context) => {
        const { getI18nLocale } = await getRequestParams(context);
        return getI18nLocale(source.nameI18n);
      },
    });

    // Attribute optionsGroup field resolver
    t.field('optionsGroup', {
      type: 'OptionsGroup',
      resolve: async (source): Promise<OptionsGroupModel | null> => {
        if (!source.optionsGroupId) {
          return null;
        }
        const db = await getDatabase();
        const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
        const optionsGroup = await optionsGroupsCollection.findOne({ _id: source.optionsGroupId });
        return optionsGroup;
      },
    });

    // Attribute options field resolver
    t.nonNull.list.nonNull.field('options', {
      type: 'Option',
      resolve: async (source): Promise<OptionModel[]> => {
        const db = await getDatabase();
        const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
        const options = await optionsCollection.find({ _id: { $in: source.optionsIds } }).toArray();
        return options;
      },
    });

    // Attribute metric field resolver
    t.field('metric', {
      type: 'Metric',
      resolve: async (source): Promise<MetricModel | null> => {
        if (!source.metricId) {
          return null;
        }
        const db = await getDatabase();
        const metricsCollection = db.collection<MetricModel>(COL_METRICS);
        const metric = await metricsCollection.findOne({ _id: source.metricId });
        return metric;
      },
    });
  },
});