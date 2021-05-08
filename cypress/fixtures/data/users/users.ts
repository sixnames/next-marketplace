// import { UserModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const adminName = 'admin';

const users = [
  {
    _id: getObjectId(adminName),
    name: adminName,
    roleId: getObjectId('adminRole'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export = users;
