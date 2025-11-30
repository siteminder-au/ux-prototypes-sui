const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '.'),
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'vue',
  ],
  moduleNameMapper: {
    '^.+\\.(css|png|scss)$': '<rootDir>/test/file-stub.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    // see: https://github.com/vuejs/test-utils/issues/721
    '^vue$': '@vue/compat',
  },
  // See known issue in: https://github.com/testing-library/user-event/issues/391
  // jest from a certain version stopped packaging in jsdom as a dep and must be manually
  // installed by the downstream project.
  // see: https://jestjs.io/blog/2021/05/25/jest-27
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    // required for vue3
    // otherwise we get the "ReferenceError: Vue is not defined"
    // see: https://test-utils.vuejs.org/migration/#-vue-vue3-jest-jest-28
    customExportConditions: ['node', 'node-addons'],
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/end-to-end',
  ],
  transform: {
    // include both .mjs and .js files to be transformed by babel-jest so jest can parse those files properly
    '^.+\\.(mjs|js)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  // by default, jest ignores transforming the entire node_modules folder
  // we want jest to transform sui specific files using babel-jest since they exist as esm files.
  // ?! means exclude certain packages (i.e. @siteminder/sui-core, @siteminder/sui-icons) from being ignored
  // see: https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  transformIgnorePatterns: [
    'node_modules/@siteminder/sui-(?!(core|icons)/)',
  ],
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/test/setup-after-env.ts'],
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
  // open issue in vue-jest project
  // see: https://github.com/vuejs/vue-jest/issues/539
  // compilerOptions.whitespace isn't being respected by jest
  // to suppress the vue warnings when running the jest tests
  // globals: {
  // 'vue-jest': {
  //   compilerOptions: {
  //     whitespace: 'preserve',
  //   },
  // },
}
