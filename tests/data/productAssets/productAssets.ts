import { ASSETS_DIST_PRODUCTS } from '../../../config/common';
import { ProductAssetsModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import products from '../products/products';

const productAssets: ProductAssetsModel[] = products.map((product) => {
  const { slug, _id, itemId } = product;

  return {
    _id: getObjectId(`productAsset ${slug}`),
    productId: _id,
    productSlug: slug,
    assets: [
      {
        index: 0,
        url: `/assets/${ASSETS_DIST_PRODUCTS}/${itemId}/${itemId}-0.png`,
      },
    ],
  };
});

// @ts-ignore
export = productAssets;
