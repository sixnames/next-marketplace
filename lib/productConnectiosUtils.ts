import { ProductConnectionModel, ProductModel } from 'db/dbModels';
import { generateDefaultLangSlug } from 'lib/slugUtils';

export interface UpdateProductConnectionsInterface {
  connections: ProductConnectionModel[];
  product: ProductModel;
}

export interface UpdateProductConnectionsPayloadInterface {
  updatedSlug: string;
}

export function createProductSlugWithConnections({
  connections,
  product,
}: UpdateProductConnectionsInterface): UpdateProductConnectionsPayloadInterface {
  const initialSlug = generateDefaultLangSlug(product.nameI18n);

  const connectionsValuesAsStringArray: string[] = connections.map(({ connectionProducts }) => {
    const connectionProduct = connectionProducts.find(({ productId }) => {
      return productId.equals(product._id);
    });
    if (!connectionProduct) {
      return '';
    }
    return connectionProduct.option.slug;
  });

  const updatedSlug = [initialSlug, ...connectionsValuesAsStringArray].join('-');

  return {
    updatedSlug,
  };
}
