import antfu from '@antfu/eslint-config'
import autoImport from './eslintrc-auto-import.js'

export default antfu({
  ignores: [
    '*', // 忽略SDK等文件
    'eslintrc-auto-import.js', // 忽略自动导入文件
  ],
  stylistic: {
    indent: 2, //  缩进
    quotes: 'single', // 单双引号
    semi: true, // 行尾分号
  },
  languageOptions: {
    globals: {
      Bol3D: 'readonly', // KT-SDK
      dat: 'readonly', // https://github.com/dataarts/dat.gui
      LATEST_BUILD_TIME: 'readable', // vite define variable
      CACHE: 'readonly', // 3D CACHE
      API: 'readonly', // 3D API
      STATE: 'readonly', // 3D STATE
      TU: 'readonly', // 3D ThreeUtils
      GUI: 'readonly', // 3D datGUI
      ...autoImport?.globals,
    },
  },
  rules: {
    'no-console': 'warn',
    'no-alert': 'warn',
    'no-debugger': 'warn',
    'no-undef': 'warn',
    'no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'vue/no-unused-vars': [
      'warn',
      {
        ignorePattern: '^_',
      },
    ],
    'unused-imports/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
  },
})
