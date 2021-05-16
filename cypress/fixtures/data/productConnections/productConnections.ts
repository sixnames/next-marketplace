import { CATALOGUE_OPTION_SEPARATOR } from '../../../../config/common';
import { ObjectIdModel, ProductConnectionModel, ProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import * as products from '../products/products';
import * as rubrics from '../rubrics/rubrics';

const connectionAttributesConfig = [
  {
    attributeId: getObjectId(`attribute Объем`),
    attributeSlug: 'obem',
  },
  {
    attributeId: getObjectId(`attribute Тип ёмкости`),
    attributeSlug: 'tip_yomkosti',
  },
  {
    attributeId: getObjectId(`attribute Год`),
    attributeSlug: 'god',
  },
  {
    attributeId: getObjectId(`attribute Винтаж`),
    attributeSlug: 'vintazh',
  },
  {
    attributeId: getObjectId(`attribute Сахар`),
    attributeSlug: 'sakhar',
  },
  {
    attributeId: getObjectId(`attribute Тип вина`),
    attributeSlug: 'tip_vina',
  },
];

const productConnections: ProductConnectionModel[] = [];

rubrics.forEach(({ slug }) => {
  connectionAttributesConfig.forEach(({ attributeSlug, attributeId }) => {
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
      _id: getObjectId(`productConnection ${attributeSlug} ${slug}`),
      attributeId,
      attributeSlug,
      productsIds,
    });
  });
});

// @ts-ignore
export = productConnections;
