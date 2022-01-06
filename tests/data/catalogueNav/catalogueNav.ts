import { CatalogueNavModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const catalogueNav: CatalogueNavModel[] = [
  {
    _id: getObjectId('fake CatalogueNavModel'),
    companySlug: 'fake',
    citySlug: 'fake',
    rubrics: [],
    createdAt: new Date(),
  },
];

// @ts-ignore
export = catalogueNav;
