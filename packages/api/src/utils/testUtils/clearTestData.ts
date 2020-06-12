import mongoose from 'mongoose';

export const clearTestDataHandler = async () => {
  const models = mongoose.modelNames();

  for await (const model of models) {
    await mongoose.model(model).deleteMany({});
  }
};

const clearTestData = async () => {
  await clearTestDataHandler();
};

export default clearTestData;
