const path = require('path')

module.exports = {
  testRunner: 'jest-jasmine2',
  rootDir: path.resolve(__dirname, '.'),
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'vue',
  ],
  moduleNameMapper: {
    '^.+\\.(png)$': '<rootDir>/test/file-stub.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // See known issue in: https://github.com/testing-library/user-event/issues/391
  // jest from a certain version stopped packaging in jsdom as a dep and must be manually
  // installed by the downstream project.
  // see: https://jestjs.io/blog/2021/05/25/jest-27
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/test/end-to-end',
  ],
  transform: {
    // include both .mjs and .js files to be transformed by babel-jest so jest can parse those files properly
    '^.+\\.(mjs|js)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue2-jest'
  },
  // We specifically tell jest to transform sui specific files using babel-jest
  // since they exist as esm files.
  // we also want to also transform these packages too:
  // vee-validate, @popperjs, uuid
  // See: https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  transformIgnorePatterns: ['node_modules/(?!(@siteminder/sui-(core|icons)|vee-validate|@popperjs|uuid)/)'],
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/test/setup-after-env'],
  coverageDirectory: '<rootDir>/test/coverage',
  // only match non-msw tests
  testMatch: [
    '**/*.spec.(js|ts)',
    '<rootDir>/src/**/*.spec.(js|ts)',
  ],
  collectCoverageFrom: [
    // page components
    'src/views/**/*.{ts,vue}',
    // page child components
    'src/components/**/*.{ts,vue}',
    // exclusions
    '!src/**/*.d.ts'
  ],
}
