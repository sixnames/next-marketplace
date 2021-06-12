import { CATALOGUE_OPTION_SEPARATOR } from '../../../../config/common';
import { ProductConnectionItemModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import products from '../products/products';
import productConnections from '../productConnections/productConnections';
import options from '../options/options';

const productConnectionItems: ProductConnectionItemModel[] = [];

productConnections.forEach((connection) => {
  const connectionProducts = products.filter((product) => {
    return connection.productsIds.some((_id) => _id.equals(product._id));
  });

  connectionProducts.forEach((product) => {
    const selectedOptionSlug = product.selectedOptionsSlugs.find((slug) => {
      const slugArray = slug.split(CATALOGUE_OPTION_SEPARATOR);
      return connection.attributeSlug === slugArray[0];
    });

    const optionsSlugArray = `${selectedOptionSlug}`.split(CATALOGUE_OPTION_SEPARATOR);
    const optionsSlug = `${optionsSlugArray[1]}`;
    const option = options.find(({ slug }) => slug === optionsSlug);

    if (option) {
      productConnectionItems.push({
        _id: getObjectId(`productConnectionItem ${connection._id} ${product._id}`),
        productId: product._id,
        productSlug: product.slug,
        connectionId: connection._id,
        optionId: option._id,
      });
    }
  });
});

// @ts-ignore
export = productConnectionItems;
