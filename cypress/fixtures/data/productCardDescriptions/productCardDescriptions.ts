import { DEFAULT_COMPANY_SLUG } from '../../../../config/common';
import { ProductCardDescriptionModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const productCardDescriptions: ProductCardDescriptionModel[] = [
  {
    _id: getObjectId('description A'),
    productId: getObjectId('viski 000081'),
    productSlug: '000081',
    companySlug: DEFAULT_COMPANY_SLUG,
    textI18n: {
      ru: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates.',
    },
  },
];

// @ts-ignore
export = productCardDescriptions;
