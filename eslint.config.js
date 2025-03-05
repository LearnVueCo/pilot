import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import globals from 'globals';


export default tseslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist', "**/.nuxt", 'docs'] },
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginVue.configs['flat/recommended'],
    ],
    rules: {
      'vue/multi-word-component-names': 'off',
      "@typescript-eslint/no-unused-vars": [
        "error", 
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    },
    files: ['**/*.{ts,vue}'],
  }
) 