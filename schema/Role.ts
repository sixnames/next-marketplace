import { objectType } from 'nexus';

export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.nonNull.objectId('_id');
    t.implements('Timestamp');
    t.nonNull.string('slug');
    t.nonNull.boolean('isStaff');
    t.nonNull.boolean('isCompanyStaff');
    t.nonNull.json('nameI18n');
    t.json('descriptionI18n');
  },
});
