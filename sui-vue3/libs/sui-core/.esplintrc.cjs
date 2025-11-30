module.exports = {
  surfaceArea: ["src/**/*.ts", "src/**/*.vue"],
  rules: [
    // typescript-eslint rules
    "@typescript-eslint/ban-types",
    "@typescript-eslint/explicit-function-return-type",
    "@typescript-eslint/no-floating-promises",
    "@typescript-eslint/no-misused-promises",
    "@typescript-eslint/no-non-null-assertion",
    "@typescript-eslint/no-unnecessary-condition",
    "@typescript-eslint/no-unsafe-argument",
    "@typescript-eslint/no-unsafe-assignment",
    "@typescript-eslint/no-unsafe-call",
    "@typescript-eslint/no-unsafe-member-access",
    "@typescript-eslint/no-unsafe-return",
    "@typescript-eslint/prefer-nullish-coalescing",
    "@typescript-eslint/require-await",
    "@typescript-eslint/restrict-plus-operands",
    "@typescript-eslint/restrict-template-expressions",
    "@typescript-eslint/unbound-method",
    "prefer-arrow/prefer-arrow-functions",
    // vue3 rules
    // eslint-plugin-vue uncategorised rules.
    "vue/no-restricted-static-attribute",
    "vue/no-unused-properties",
  ]
};
