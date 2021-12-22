import { FILTER_SEPARATOR } from '../../../config/common';
import { ObjectIdModel, ProductConnectionModel, ProductFacetModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import products from '../products/products';
import rubrics from '../rubrics/rubrics';

const connectionAttributesConfig = [
  {
    attributeId: getObjectId(`attribute Объем`),
    attributeSlug: '000007',
  },
  {
    attributeId: getObjectId(`attribute Тип ёмкости`),
    attributeSlug: '000008',
  },
  {
    attributeId: getObjectId(`attribute Год`),
    attributeSlug: '000009',
  },
  {
    attributeId: getObjectId(`attribute Винтаж`),
    attributeSlug: '000011',
  },
  {
    attributeId: getObjectId(`attribute Сахар`),
    attributeSlug: '000012',
  },
  {
    attributeId: getObjectId(`attribute Тип вина`),
    attributeSlug: '000015',
  },
];

const productConnections: ProductConnectionModel[] = [];

rubrics.forEach(({ slug }) => {
  connectionAttributesConfig.forEach(({ attributeSlug, attributeId }) => {
    const rubricProducts = products.filter(({ rubricSlug }) => slug === rubricSlug);
    const attributeProducts = rubricProducts.filter(({ selectedAttributesIds }) => {
      return selectedAttributesIds.some((_id) => _id.equals(attributeId));
    });

    const connectionProducts: ProductFacetModel[] = [];

    attributeProducts.forEach((product) => {
      const selectedOptionSlug = product.selectedOptionsSlugs.find((slug) => {
        const slugArray = slug.split(FILTER_SEPARATOR);
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
      _id: getObjectId(`productConnection ${attributeSlug} ${slug}`),
      attributeId,
      attributeSlug,
      productsIds,
    });
  });
});

// @ts-ignore
export = productConnections;
