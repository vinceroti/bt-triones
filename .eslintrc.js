module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "prettier",
    "prettier/vue",
    "plugin:prettier/recommended",
    "plugin:vue-a11y/base",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  // required to lint *.vue files
  plugins: ["prettier", "vue-a11y"],
  // add your custom rules here
  rules: {
    "object-shorthand": "off",
    "prettier/prettier": "error",
    camelcase: "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/name-property-casing": ["error", "kebab-case"],
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
      },
    ],
    "vue/no-v-html": process.env.NODE_ENV === "production" ? "off" : "warn",
    "vue-a11y/click-events-have-key-events": "off",
    "vue-a11y/media-has-caption": "off",
    "vue/require-component-is": "off",
  },
};
