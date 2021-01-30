import { makeSchema } from 'nexus';
import path from 'path';
import * as types from './index';

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(process.cwd(), 'generated', 'schema.graphql'),
    typegen: path.join(process.cwd(), 'generated', 'nexus.ts'),
  },
  sourceTypes: {
    modules: [
      {
        module: path.join(process.cwd(), 'db', 'dbModels.ts'),
        alias: 'dbModels',
        typeMatch(type, _defaultRegex) {
          return new RegExp(`(?:interface|type|class|enum)\\s+(${type.name}Model)\\W`, 'g');
        },
      },
    ],
    // debug: process.env.NODE_ENV === 'development',
  },
  contextType: {
    module: path.join(process.cwd(), 'types', 'apiContextTypes.ts'),
    export: 'NexusContext',
  },
  prettierConfig: path.join(process.cwd(), '.prettierrc'),
  features: {
    abstractTypeStrategies: {
      resolveType: true,
    },
  },
});
