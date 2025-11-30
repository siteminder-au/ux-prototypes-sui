module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^#/(.*)$': '<rootDir>/test/$1',
  },
  // See known issue in: https://github.com/testing-library/react-testing-library/issues/422
  // otherwise you get the error `ReferenceError: document is not defined`
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // required for vue3
    // otherwise we get the "ReferenceError: Vue is not defined"
    customExportConditions: ["node", "node-addons"],
  },
  testMatch: [
    '<rootDir>/src/**/*.spec.(js|ts)',
  ],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  // by default, jest ignores transforming the entire node_modules folder
  // see: https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  transformIgnorePatterns: [],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/**/*.stories.ts',
    '!src/**/*.stories.deprecated.ts',
    '!src/**/index.ts',
    '!src/**/icons-out/**',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup-after-env.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
