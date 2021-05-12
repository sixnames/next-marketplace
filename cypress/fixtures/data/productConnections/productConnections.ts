import { CATALOGUE_OPTION_SEPARATOR } from '../../../../config/common';
import { ObjectIdModel, ProductConnectionModel, ProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import * as products from '../products/products';
import * as rubrics from '../rubrics/rubrics';

const productConnections: ProductConnectionModel[] = [];

rubrics.forEach(({ slug }) => {
  const attributeId = getObjectId(`attribute Объем`);
  const attributeSlug = 'obem';
  const rubricProducts = products.filter(({ rubricSlug }) => slug === rubricSlug);
  const attributeProducts = rubricProducts.filter(({ selectedAttributesIds }) => {
    return selectedAttributesIds.some((_id) => _id.equals(attributeId));
  });

  const connectionProducts: ProductModel[] = [];

  attributeProducts.forEach((product) => {
    const selectedOptionSlug = product.selectedOptionsSlugs.find((slug) => {
      const slugArray = slug.split(CATALOGUE_OPTION_SEPARATOR);
      return attributeSlug === slugArray[0];
    });

    const exist = connectionProducts.some(({ selectedOptionsSlugs }) => {
      return selectedOptionsSlugs.includes(`${selectedOptionSlug}`);
    });
    if (!exist) {
      connectionProducts.push(product);
    }
  });

  const productsIds: ObjectIdModel[] = connectionProducts.map(({ _id }) => _id);

  productConnections.push({
    _id: getObjectId(`productConnection ${slug}`),
    attributeId,
    attributeSlug,
    productsIds,
  });
});

export = productConnections;
