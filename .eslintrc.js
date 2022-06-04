module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019, // Node.js 12の場合は2019、他のバージョンのNode.jsを利用している場合は場合は適宜変更する
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  rules: {
    "@typescript-eslint/no-var-requires": "off", // インポートするファイル名に変数を利用するため関数内に記述する必要がある
    "@typescript-eslint/no-unsafe-argument": "off", // markdown処理コンポーネントで必要
    "@typescript-eslint/ban-ts-comment": "off"
  },
};