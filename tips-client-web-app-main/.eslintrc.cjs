module.exports = {
  extends: 'react-app',
  globals: {
    'jest': true,
    'browser': true,
    'URL': true,
    'localStorage': true,
    'fetch': true
  },
  plugins: [
    '@stylistic',
    '@stylistic/js',
  ],
  rules: {
    // '@stylistic/js/max-len': ['warn', { 'code': 120 }],
    // 'linebreak-style': ["error", "unix"],
    '@stylistic/indent': ['warn', 2, {
      'SwitchCase': 2
    }],

    'no-multi-spaces': 'error',
    'semi': [2, 'never'],
    'quotes': ['error', 'single'],
    'no-unused-expressions': ['error', {
      'allowTernary': true
    }],
    'object-curly-spacing': ['error', 'always'],
  }
}
