module.exports = {
  "root": true,
  "extends": [
    "@siteminder/eslint-config/vue",
    "plugin:jest-dom/recommended",
    "plugin:testing-library/vue",
    // vue3
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:vue/vue3-recommended",
    // linting rules for typescript
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:@stylistic/recommended-extends"
  ],
  "plugins": [
    "@stylistic",
    "jest-dom",
    "testing-library",
    // this plugin helps lint for unused imports in a file
    "unused-imports"
  ],
  // these rules have been adopted from MP.
  // see: https://github.com/siteminder-au/platform-enterprise/blob/master/frontends/enterprise/.eslintrc.json
  "rules": {
    "@typescript-eslint/await-thenable": ["warn"],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-ignore": "allow-with-description",
        "ts-nocheck": "allow-with-description"
      }
    ],
    "@typescript-eslint/ban-types": ["warn"],
    "@typescript-eslint/consistent-type-assertions": [
      "warn",
      {
        "assertionStyle": "as",
        "objectLiteralTypeAssertions": "never"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": ["warn", { "allowExpressions": true }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": [
          "objectLiteralProperty",
          "objectLiteralMethod", // mainly for keys inside the `emits` object
          "typeProperty"
        ],
        "format": null,
        "modifiers": [
          // match any string that requires quotes (strings that have spaces, dashes, etc)
          // sometimes we need a key that doesn't conform to a certain format in an object (e.g. `menu-button` or `No-change`)
          "requiresQuotes"
        ]
      },
      {
        "selector": "default",
        "format": ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
        "leadingUnderscore": "allowSingleOrDouble"
      }
    ],
    "@typescript-eslint/no-empty-function": ["error", { "allow": ["arrowFunctions", "methods"] }],
    "@typescript-eslint/no-empty-interface": ["error"],
    "@typescript-eslint/no-explicit-any": ["warn", { "ignoreRestArgs": true }],
    "@typescript-eslint/no-extra-non-null-assertion": ["error"],
    "@typescript-eslint/no-floating-promises": ["warn"],
    "@typescript-eslint/no-inferrable-types": ["warn"],
    "@typescript-eslint/no-misused-promises": ["warn"],
    "@typescript-eslint/no-namespace": ["error"],
    "@typescript-eslint/no-non-null-asserted-optional-chain": ["error"],
    "@typescript-eslint/no-non-null-assertion": ["warn"],
    "@typescript-eslint/no-unnecessary-condition": ["warn"],
    "@typescript-eslint/no-unnecessary-type-assertion": ["warn"],
    "@typescript-eslint/no-unsafe-argument": ["warn"],
    "@typescript-eslint/no-unsafe-assignment": ["warn"],
    "@typescript-eslint/no-unsafe-call": ["warn"],
    "@typescript-eslint/no-unsafe-member-access": ["warn"],
    "@typescript-eslint/no-unsafe-return": ["warn"],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-var-requires": ["warn"],
    "@typescript-eslint/prefer-as-const": ["error"],
    "@typescript-eslint/prefer-nullish-coalescing": ["warn"],
    "@typescript-eslint/require-await": ["warn"],
    "@typescript-eslint/restrict-plus-operands": ["warn"],
    "@typescript-eslint/restrict-template-expressions": ["warn"],
    "@typescript-eslint/unbound-method": ["warn"],
    "default-param-last": ["error"],
    // require a capital letter for constructors
    "new-cap": [
      "error",
      {
        "newIsCap": true,
        "newIsCapExceptions": ["i18n"],
        "capIsNew": false,
        "capIsNewExceptions": ["Immutable.Map", "Immutable.Set", "Immutable.List"]
      }
    ],
    "no-console": ["error", { "allow": ["info", "warn", "error"] }],
    "no-param-reassign": ["error", { "props": false }],
    "no-restricted-imports": [
      "error",
      {
        "name": "@siteminder/sui-core",
        "importNames": ["toastService"],
        "message": "Please use the useToastService composable from @/composables/use-toast-service instead"
      }
    ],
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "prefer-arrow/prefer-arrow-functions": ["warn"],
    // we want to turn off no-container because we want to run
    // container.querySelector in certain cases to reduce the scope of searching
    "testing-library/no-container": ["off"],
    // we want to turn off no-node-access because there are times we need
    // to use .querySelector as a last resort to grab the element we want
    // but is heavily advertised as a last resort when all other VTL selectors
    // are exhausted.
    // e.g. for icons, use screen.getByLabelText() over .querySelector('.icon-name')
    // by providing an aria-label
    "testing-library/no-node-access": ["off"],
    "unused-imports/no-unused-imports": ["error"],
    "unused-imports/no-unused-vars": ["error", { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }],
    // #region migrate deprecated formatting eslint rules to stylistic
    // https://eslint.org/blog/2023/10/deprecating-formatting-rules/
    // We then use the shared recommended config in `@stylistic/recommended-extends`
    // And then override the rules that conflicts with @siteminder/eslint-config
    // and its airbnb extension to sync back again with SM conventions. See
    // https://github.com/siteminder-au/arch-packages/blob/master/packages/eslint-config/lib/base.js
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
    "@stylistic/padded-blocks": ["off"],
    "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "@stylistic/quote-props": ["error", "as-needed", { keywords: false, unnecessary: true, numbers: false }],
    "@stylistic/comma-dangle": ["error", {
      arrays: "always-multiline",
      objects: "always-multiline",
      imports: "always-multiline",
      exports: "always-multiline",
      functions: "always-multiline",
      enums: "always-multiline",
    }],
    "@stylistic/multiline-ternary": ["off", "never"],
    "@stylistic/semi-style": ["error", "first"],
    // Project-level config
    "@stylistic/function-paren-newline": ["error", "multiline-arguments"],
    "max-len": ["off"],
    "@stylistic/max-len": ["off"],
    // #endregion
    // #region vue related
    // the following rules are included
    // in "plugin:vue/recommended" and "plugin:vue/strongly-recommended"
    // but they are set as warnings. In MP, we will make these trigger errors instead
    "vue/attribute-hyphenation": ["error"],
    "vue/attributes-order": ["error"],
    // prefer kebab-case over default PascalCase as SUI registers using kebab-case
    // also we use kebab-case so that teams that are still on sputnik can use
    // sputnik and sui together. At some point, we can change this to PascalCase once
    // there are no more projects using sputnik.
    "vue/component-definition-name-casing": ["error", "kebab-case"],
    "vue/html-closing-bracket-newline": ["error"],
    "vue/html-closing-bracket-spacing": ["error"],
    "vue/html-indent": ["error"],
    "vue/html-quotes": ["error"],
    /**
     * Disable for svg tags since it's breaking the syntax highlighting
     */
    "vue/html-self-closing": ["error", {
      "svg": "never"
    }],
    "vue/max-attributes-per-line": ["error"],
    "vue/multiline-html-element-content-newline": ["error"],
    "vue/mustache-interpolation-spacing": ["error"],
    "vue/no-child-content": ["error"],
    "vue/no-multi-spaces": ["error"],
    "vue/no-spaces-around-equal-signs-in-attribute": ["error"],
    "vue/no-v-html": ["error"],
    // Having this on adds some additional whitespace which may not be desired or break some tests
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/this-in-template": ["error"],
    "vue/v-bind-style": ["error"],
    "vue/v-on-style": ["error"],
    // #endregion
    // #region vue3 specific rules.
    // This will help us migrate to vue3 easier
    // if we can fix all the warnings now while we are still in vue2
    "vue/no-deprecated-dollar-listeners-api": ["error"],
    "vue/no-deprecated-dollar-scopedslots-api": ["warn"],
    "vue/no-deprecated-router-link-tag-prop": ["warn"],
    "vue/no-deprecated-slot-attribute": ["warn"],
    "vue/no-deprecated-slot-scope-attribute": ["warn"],
    // decided to turn off "vue/no-deprecated-v-bind-sync" and use prop.sync since its shorter syntax
    // when we move to vue3, eslint should be able to auto-fix this for us.
    "vue/no-deprecated-v-bind-sync": ["off"],
    "vue/no-deprecated-v-on-native-modifier": ["error"],
    "vue/no-ref-as-operand": ["error"],
    "vue/no-setup-props-destructure": ["error"],
    "vue/no-v-for-template-key-on-child": ["error"], // conflicting rule with vue2 "vue/no-v-for-template-key"
    // #endregion
    // #region eslint-vue uncategorised rules.
    "vue/block-lang": [
      "error",
      {
        "script": { "lang": "ts" },
        "style": { "lang": "scss" }
      }
    ],
    "vue/block-tag-newline": ["error"],
    "vue/component-api-style": ["error", ["script-setup"]],
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "vue/component-options-name-casing": ["error"],
    "vue/custom-event-name-casing": ["error", "kebab-case"],
    "vue/define-macros-order": ["error"],
    "vue/html-comment-content-newline": ["error"],
    "vue/html-comment-content-spacing": ["error"],
    "vue/html-comment-indent": ["error"],
    "vue/match-component-file-name": ["error", { "extensions": ["vue"] }],
    "vue/match-component-import-name": ["error"],
    // there are certain cases where we want a single word for a component especially for page components
    "vue/multi-word-component-names": ["off"],
    "vue/next-tick-style": ["error"],
    "vue/no-bare-strings-in-template": ["error"],
    "vue/no-duplicate-attr-inheritance": ["error"],
    "vue/no-empty-component-block": ["error"],
    "vue/no-multiple-objects-in-class": ["error"],
    "vue/no-potential-component-option-typo": ["error", { "presets": ["all"] }],
    "vue/no-restricted-static-attribute": [
      "error",
      {
        "key": "style",
        "message": "Using inline \"style\" is not allowed. Please use a class name instead."
      }
    ],
    "vue/no-restricted-v-bind": ["error"],
    "vue/no-this-in-before-route-enter": ["error"],
    "vue/no-undef-components": ["error", { "ignorePatterns": ["mp-.*", "sm-.*", "Sm.*", "router-view", "router-link", "i18n"] }],
    "vue/no-undef-properties": ["error"],
    "vue/no-unsupported-features": ["error"],
    "vue/no-unused-properties": ["error"],
    "vue/no-unused-refs": ["error"],
    "vue/no-useless-mustaches": ["error"],
    "vue/no-useless-v-bind": ["error"],
    "vue/no-v-text": ["error"],
    "vue/padding-line-between-blocks": ["error"],
    "vue/prefer-prop-type-boolean-first": ["error"],
    "vue/prefer-true-attribute-shorthand": ["error", "never"],
    "vue/require-direct-export": ["error"],
    "vue/require-emit-validator": ["error"],
    // to ensure that our eslint-plugin-mp rules work
    // also useful for Vue DevTools to easily identify components
    "vue/require-name-property": ["error"],
    // bug in @siteminder/eslint-config v4.0.0
    // where switchCase was in the same indentation
    // level as the `switch`.
    "vue/script-indent": ["error", 2, { "switchCase": 1 }],
    // "vue/sort-keys": [ "off" ], // might be too noisy, there are cases where we want a certain order which is not alphabetical
    "vue/static-class-names-order": ["warn"],
    "vue/v-for-delimiter-style": ["error"],
    // #endregion
  },
  "overrides": [
    {
      "files": ["*.vue"],
      "rules": {
        // no-undef doesn't play nice with <script setup> built-in functions
        // like withDefaults, defineProps, defineEmits
        "no-undef": "off",
        // conflicts with 'vue/script-indent'
        // see: https://eslint.vuejs.org/rules/script-indent.html
        "indent": "off",
        // turning these off so we are able to inline props/emits types
        // in a neat way in a vue file using <script setup>
        "no-spaced-func": "off",
        "func-call-spacing": "off",
        "@stylistic/func-call-spacing": "off"
      }
    },
    {
      "files": ["*.stories.ts"],
      "rules": {
        // Turn off to reduce the amount of refactors we need to do to make Storybook APIs
        // type safe. Hopefully, this is going to be easier to do once upgraded to version 7
        // See https://storybook.js.org/blog/improved-type-safety-in-storybook-7/
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    },
    {
      "files": ["sm-icon.vue"],
      "rules": {
        // The SVG path is coming from our side, should be good to disable
        // unless we add a feature that accepts user input
        "vue/no-v-html": "off"
      }
    }
  ],
  "parser": "vue-eslint-parser",
  // parserOptions is required for more advanced eslint rules to work
  // i.e. @typescript-eslint/no-unsafe-return
  "parserOptions": {
    "project": "./tsconfig.json",
    "extraFileExtensions": [".vue"]
  }
}
