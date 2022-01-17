import { getUserInitialNotificationsConf } from '../../../lib/getUserNotificationsTemplate';
import { UserModel } from '../../../db/dbModels';
import { getObjectId, getObjectIds } from 'mongo-seeding';

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
    notifications: getUserInitialNotificationsConf(),
    categoryIds: getObjectIds(['Company A category 1', 'Company B category 1']),
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
    notifications: getUserInitialNotificationsConf(),
    categoryIds: [],
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
    notifications: getUserInitialNotificationsConf(),
    categoryIds: [],
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
    notifications: getUserInitialNotificationsConf(),
    categoryIds: [],
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
    notifications: getUserInitialNotificationsConf(),
    categoryIds: [],
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
    notifications: getUserInitialNotificationsConf(),
    categoryIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('guest c'),
    itemId: '000007',
    name: 'User',
    lastName: 'C',
    secondName: '',
    email: 'userC@gmail.com',
    phone: '+75556667700',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('guestRole'),
    notifications: getUserInitialNotificationsConf(),
    categoryIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('guest d'),
    itemId: '000008',
    name: 'User',
    lastName: 'D',
    secondName: '',
    email: 'userD@gmail.com',
    phone: '+75556668800',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('guestRole'),
    notifications: getUserInitialNotificationsConf(),
    categoryIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: getObjectId('content manager'),
    itemId: '000009',
    name: 'Content',
    lastName: 'Manager',
    secondName: '',
    email: 'contentManager@gmail.com',
    phone: '+75556668811',
    password,
    avatar: null,
    cartId: null,
    roleId: getObjectId('contentManagerRole'),
    notifications: getUserInitialNotificationsConf(),
    categoryIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// @ts-ignore
export = users;