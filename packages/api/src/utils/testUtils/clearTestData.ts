import mongoose from 'mongoose';

const clearTestData = async () => {
  const modelsNames = mongoose.modelNames();
  for await (const model of modelsNames) {
    await mongoose.model(model).deleteMany({});
  }
};

export default clearTestData;
