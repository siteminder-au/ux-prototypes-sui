/* eslint-env node */
module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'semi': [1, 'always'],
    'quotes': [1, 'single']
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
};