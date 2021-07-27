import { objectType } from 'nexus';

export const ProductCardContent = objectType({
  name: 'ProductCardContent',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.objectId('productSlug');
    t.nonNull.string('content');
  },
});
