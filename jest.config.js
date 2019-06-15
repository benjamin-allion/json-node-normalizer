
module.exports = {
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98,
    },
    './lib/**/*.js': {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98,
    },
    './lib/*.js': {
      branches: 98,
      functions: 98,
      lines: 98,
      statements: 98,
    },
  },
  moduleFileExtensions: [
    'js',
    'json',
    'node',
  ],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/lib/$1' },
  collectCoverageFrom: [
    'lib/**/*.js',
    'lib/*.js',
  ],
  testEnvironment: 'node',


  testMatch: [
    // '**/tests/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
  ],

  watchman: true,

};
