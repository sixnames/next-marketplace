import { FILTER_SEPARATOR } from '../../../config/common';
import { ProductConnectionItemModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import productFacets from '../productFacets/productFacets';
import productConnections from '../productConnections/productConnections';
import options from '../options/options';

const productConnectionItems: ProductConnectionItemModel[] = [];

productConnections.forEach((connection) => {
  const connectionProducts = productFacets.filter((product) => {
    return connection.productsIds.some((_id) => _id.equals(product._id));
  });

  connectionProducts.forEach((product) => {
    const selectedOptionSlug = product.selectedOptionsSlugs.find((slug) => {
      const slugArray = slug.split(FILTER_SEPARATOR);
      return connection.attributeSlug === slugArray[0];
    });

    const optionsSlugArray = `${selectedOptionSlug}`.split(FILTER_SEPARATOR);
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
