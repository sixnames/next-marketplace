const tsPreset = require('ts-jest/jest-preset');
const mongoPreset = require('@shelf/jest-mongodb/jest-preset');
require('dotenv').config();

module.exports = {
  ...tsPreset,
  ...mongoPreset,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/test/jest.setup.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
