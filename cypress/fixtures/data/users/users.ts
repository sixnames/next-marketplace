import { UserModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const password = '$2b$10$u7zEl9.8vpdshO9tbBIHXeM5HrhLQBCEJ6mcQVSSP0B.WCb9rVE.K';

const users: UserModel[] = [
  {
    _id: getObjectId('admin'),
    itemId: '000001',
    name: 'admin',
    lastName: 'Site',
    secondName: 'Second',
    email: 'admin@gmail.com',
    phone: '+78889990011',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('adminRole'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('company owner a'),
    itemId: '000002',
    name: 'Owner',
    lastName: 'Company',
    secondName: 'A',
    email: 'ownerA@gmail.com',
    phone: '+71112223344',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('companyOwnerRole'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('company manager b'),
    itemId: '000003',
    name: 'Manager',
    lastName: 'Company',
    secondName: 'A',
    email: 'managerA@gmail.com',
    phone: '+71112223345',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('companyManagerRole'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('company owner b'),
    itemId: '000004',
    name: 'Owner',
    lastName: 'Company',
    secondName: 'B',
    email: 'ownerB@gmail.com',
    phone: '+72223334455',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('companyOwnerRole'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('guest'),
    itemId: '000005',
    name: 'Guest',
    lastName: 'Buyer',
    secondName: '',
    email: 'guest@gmail.com',
    phone: '+75556667788',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('guestRole'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('guest b'),
    itemId: '000006',
    name: 'User',
    lastName: 'Buyer',
    secondName: '',
    email: 'user@gmail.com',
    phone: '+75556667799',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('guestRole'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = users;
