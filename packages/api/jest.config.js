const tsPreset = require('ts-jest/jest-preset');
const mongoPreset = require('@shelf/jest-mongodb/jest-preset');

module.exports = {
  ...tsPreset,
  ...mongoPreset,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/test/setup.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
