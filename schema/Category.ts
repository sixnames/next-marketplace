import { objectType } from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('slug');
    t.nonNull.json('nameI18n');
    t.string('icon');
    t.string('image');
    t.nonNull.objectId('rubricId');
    t.objectId('parentId');
    t.nonNull.json('views');
    t.nonNull.json('priorities');
    t.nonNull.json('variants');
  },
});
