import { objectType } from 'nexus';

export const ProductCardPrices = objectType({
  name: 'ProductCardPrices',
  definition(t) {
    t.nonNull.string('min');
    t.nonNull.string('max');
  },
});

export const ProductAssets = objectType({
  name: 'ProductAssets',
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.objectId('productId');
    t.nonNull.string('productSlug');
    t.nonNull.list.nonNull.field('assets', {
      type: 'Asset',
    });
  },
});

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.implements('Base');
    t.implements('Timestamp');
    t.nonNull.boolean('active');
    t.nonNull.string('slug');
    t.nonNull.string('originalName');
    t.string('barcode');
    t.string('brandSlug');
    t.string('brandCollectionSlug');
    t.string('manufacturerSlug');
    t.string('supplierSlug');
    t.json('nameI18n');
    t.json('descriptionI18n');
    t.nonNull.objectId('rubricId');
    t.nonNull.string('rubricSlug');
    t.boolean('available');
    t.nonNull.string('mainImage');
  },
});
