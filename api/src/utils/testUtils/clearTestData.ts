import mongoose from 'mongoose';
import createInitialData from '../createInitialData';

export const clearTestDataHandler = async () => {
  await mongoose.connection.db.dropDatabase();
  await createInitialData();
  /*const models = mongoose.modelNames();

  for await (const model of models) {
    if (model === 'User') {
      await mongoose.model(model).deleteMany({
        name: {
          $ne: ADMIN_NAME,
        },
      });
    } else {
      await mongoose.model(model).deleteMany({});
    }
  }*/
};

const clearTestData = async () => {
  await clearTestDataHandler();
};

export default clearTestData;
