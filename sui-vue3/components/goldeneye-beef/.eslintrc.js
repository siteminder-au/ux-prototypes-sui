/* eslint-env node */
module.exports = {
  extends: [
    '@siteminder/eslint-config/node',
  ],
  rules: {
    camelcase: 'off',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/no-floating-promises': [
      'error',
      {
        ignoreIIFE: true,
      },
    ],
    'import/no-extraneous-dependencies': 'off',
  },
  parserOptions: {
    project: ['./tsconfig.json'],
  },
}
