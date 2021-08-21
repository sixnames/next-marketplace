import { objectType } from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.json('nameI18n');
    t.nonNull.json('descriptionI18n');
    t.nonNull.json('shortDescriptionI18n');
    t.nonNull.string('slug');
    t.string('icon');
    t.string('image');
    t.nonNull.boolean('active');
    t.nonNull.objectId('variantId');
    t.nonNull.objectId('rubricId');
    t.objectId('parentId');
    t.nonNull.json('views');
    t.boolean('capitalise');
    t.nonNull.json('priorities');
    t.nonNull.field('catalogueTitle', {
      type: 'RubricCatalogueTitle',
    });
  },
});
