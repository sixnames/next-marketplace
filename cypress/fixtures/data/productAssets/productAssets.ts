import { ProductAssetsModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import * as products from '../products/products';

const productAssets: ProductAssetsModel[] = products.map((product) => {
  return {
    _id: getObjectId(`productAsset ${product.slug}`),
    productId: product._id,
    productSlug: product.slug,
    assets: [
      {
        index: 0,
        url: '',
      },
    ],
  };
});

export = productAssets;
