import mongoose from 'mongoose';
import { ADMIN_NAME } from '../../config';
// TODO make this method safe
export const clearTestDataHandler = async () => {
  const models = mongoose.modelNames();

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
  }
};

const clearTestData = async () => {
  await clearTestDataHandler();
};

export default clearTestData;
