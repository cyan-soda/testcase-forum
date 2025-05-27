import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest', // Use babel-jest for JS/TS files
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @/ to src/
    '^@/icons/(.*)$': '<rootDir>/src/icons/$1', // Map @/icons/ to src/icons/
    '\\.(svg)$': '<rootDir>/__mocks__/svgMock.js', // Mock SVG files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};

export default config;