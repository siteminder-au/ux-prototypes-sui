module.exports = {
  surfaceArea: ["src/**/*.ts", "src/**/*.vue"],
  rules: [
    // typescript-eslint rules
    "@typescript-eslint/consistent-type-assertions",
    "@typescript-eslint/explicit-function-return-type",
    "@typescript-eslint/no-explicit-any",
    "@typescript-eslint/no-namespace",
    "@typescript-eslint/no-unnecessary-condition",
    "@typescript-eslint/no-unsafe-argument",
    "@typescript-eslint/no-unsafe-assignment",
    "@typescript-eslint/no-unsafe-return",
    "@typescript-eslint/no-var-requires",
    "@typescript-eslint/require-await",
    // vue3 rules
    // "vue/no-deprecated-v-on-native-modifier",
    // eslint-plugin-vue uncategorised rules.
    "vue/no-bare-strings-in-template",
    "vue/no-restricted-static-attribute",
    "vue/no-undef-properties",
    "vue/prefer-true-attribute-shorthand",
    "vue/require-name-property"
  ]
};