module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    // Include css for the v-calendar/style.css import
    '.+\\.(svg|css)$': 'identity-obj-proxy',
    '^#/(.*)$': '<rootDir>/test/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    // jest doesn't support es6 module syntax out of the box.
    // - see: https://stackoverflow.com/questions/59879689/jest-syntaxerror-cannot-use-import-statement-outside-a-module
    // - see: https://github.com/vuejs/vue-cli/issues/2040
    // so for lodash and vue-multiselect, we need to tell jest to use the cjs version of these packages.
    // previously we could use babel-jest to transpile these packages to cjs format so it can be understood by jest.
    // if we had configured babel-jest in `transform` object, then jest was smart enough to grab the cjs version in packageName/dist/*.common.js.
    // see: https://stackoverflow.com/questions/42260218/jest-setup-syntaxerror-unexpected-token-export
    // TODO: in the future, we should replace all lodash functions with native es functions
    // see: https://siteminder-jira.atlassian.net/browse/SUI-2147
    // and remove this mapping. see: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
    // NOTE: `lodash` is installed as a transitive dependency of some of our packages (e.g. esplint)
    "^lodash-es$": "lodash",
    '^vue-multiselect$': 'vue-multiselect/dist/vue-multiselect.common.js',
    // https://github.com/SortableJS/vue.draggable.next/issues/117
    '^vuedraggable/src/vuedraggable$': 'vuedraggable'
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
    '/node_modules/@ckpack/vue-color.+\\.(mjs|js)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': [ 'ts-jest', {
      tsconfig: {
        strict: true
      }
    }],
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  transformIgnorePatterns: [
    // jest cannot handle ES modules by default yet and the package doesn't have a cjs build
    '/node_modules/(?!@ckpack/vue-color)',
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    // other files
    '!src/**/*.types.ts',
    '!src/**/*.stories.ts',
    '!src/**/*.stories.deprecated.ts',
    '!src/**/timezones-sample.ts',
    '!src/**/index.ts',
    '!src/**/samples/**',
    '!src/**/*.d.ts',
    '!src/config.ts',
    '!src/assets/**/*.ts',
    '!src/setup/**/*.ts',
    '!src/main.ts',
    '!src/app/component-names.ts',
    '!src/app/lang/**',
    '!src/router/index.ts',
    '!src/router/routes/**',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup-after-env.ts'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 83,
      lines: 85,
      statements: 80,
    },
  },
}
