import { objectType } from 'nexus';

export const ProductConnection = objectType({
  name: 'ProductConnection',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('attributeId');
    t.nonNull.string('attributeSlug');
    t.json('attributeNameI18n');
  },
});
