import { CompanyModel } from '../../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

const cities: CompanyModel[] = [
  {
    _id: getObjectId('company Company A'),
    itemId: '000001',
    slug: 'company_a',
    name: 'Company A',
    staffIds: getObjectIds(['company manager b']),
    ownerId: getObjectId('company owner a'),
    shopsIds: [],
    contacts: {
      phones: ['+71112223344'],
      emails: ['companyA@gmail.com'],
    },
    logo: {
      index: 1,
      url: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('company Company B'),
    itemId: '000002',
    slug: 'company_b',
    name: 'Company B',
    staffIds: [],
    ownerId: getObjectId('company owner b'),
    shopsIds: [],
    contacts: {
      phones: ['+72223334455'],
      emails: ['companyB@gmail.com'],
    },
    logo: {
      index: 1,
      url: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export = cities;
