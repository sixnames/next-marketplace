import mongoose from 'mongoose';
import createInitialData from '../createInitialData';

export const clearTestDataHandler = async () => {
  await mongoose.connection.db.dropDatabase();
  await createInitialData();
};

const clearTestData = async () => {
  await clearTestDataHandler();
};

export default clearTestData;
