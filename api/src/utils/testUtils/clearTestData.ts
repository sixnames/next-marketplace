import mongoose from 'mongoose';
import createInitialData from '../initialData/createInitialData';

const clearTestData = async () => {
  const modelsNames = mongoose.modelNames();
  for await (const model of modelsNames) {
    await mongoose.model(model).deleteMany({});
  }
  await createInitialData();
};

export default clearTestData;
