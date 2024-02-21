module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        endOfLine: 'auto',
        arrowParens: 'avoid',
      },
    ],
    'react-native/no-inline-styles': 'off',
  },
};
