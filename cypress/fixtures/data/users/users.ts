import { UserModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const adminName = 'admin';
const password = '$2b$10$u7zEl9.8vpdshO9tbBIHXeM5HrhLQBCEJ6mcQVSSP0B.WCb9rVE.K';

const users: UserModel[] = [
  {
    _id: getObjectId(adminName),
    itemId: '000001',
    lastName: 'Site',
    secondName: 'Second',
    email: 'admin@gmial.com',
    phone: '+78889990011',
    password,
    avatar: null,
    cartId: null,
    name: adminName,
    roleId: getObjectId('adminRole'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export = users;
