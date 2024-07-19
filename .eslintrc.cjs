// .eslintrc.cjs
module.exports = {
  parser: "@typescript-eslint/parser", // TypeScript parser
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended", // 기본 ESLint 권장 규칙
    "plugin:react/recommended", // React 권장 규칙
    "plugin:@typescript-eslint/recommended", // TypeScript 권장 규칙
  ],
  plugins: ["react", "@typescript-eslint"],
  rules: {
    // 사용자 정의 규칙
    "react/react-in-jsx-scope": "off", // React 17 이상에서는 필요하지 않음
    "@typescript-eslint/explicit-module-boundary-types": "off", // 함수에 타입 정의 강제하지 않음
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // 사용하지 않는 변수 허용(변수명이 _로 시작)
  },
  settings: {
    react: {
      version: "detect", // React 버전 자동 감지
    },
  },
};
