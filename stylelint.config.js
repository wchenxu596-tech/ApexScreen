/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: ['defineOptions'] }],
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep', 'deep'] }],
    'no-descending-specificity': null,
    'color-function-notation': 'legacy',
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'value-keyword-case': null,
    'declaration-block-single-line-max-declarations': null,
    'custom-property-pattern': null,
  },
}
