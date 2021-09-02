import { BlogLikeModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const blogLikes: BlogLikeModel[] = [
  {
    _id: getObjectId('post like a'),
    blogPostId: getObjectId('post a'),
    userId: getObjectId('admin'),
  },
];

// @ts-ignore
export = blogLikes;
