module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always',
      },
    }],
    // 'vue/max-attributes-per-line': ['warn', {
    //   singleline: 4,
    //   multiline: 1,
    // }],
    'vue/max-attributes-per-line': 'off',
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style'],
    }],
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
