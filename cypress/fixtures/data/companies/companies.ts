import { ASSETS_DIST_COMPANIES } from '../../../../config/common';
import { CompanyModel } from '../../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

const companies: CompanyModel[] = [
  {
    _id: getObjectId('company Company A'),
    itemId: '000001',
    slug: 'company_a',
    name: 'Company A',
    domain: 'domain.com',
    staffIds: getObjectIds(['company manager b']),
    ownerId: getObjectId('company owner a'),
    shopsIds: getObjectIds(['shop Shop A']),
    contacts: {
      phones: ['+71112223344', '+71112224444'],
      emails: ['companyA@gmail.com', 'companyAB@gmail.com'],
    },
    logo: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_COMPANIES}/000001/000001-0.webp`,
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
    shopsIds: getObjectIds(['shop Shop B', 'shop Shop C']),
    contacts: {
      phones: ['+72223334455'],
      emails: ['companyB@gmail.com', 'companyBB@gmail.com'],
    },
    logo: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_COMPANIES}/000002/000002-0.webp`,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = companies;
