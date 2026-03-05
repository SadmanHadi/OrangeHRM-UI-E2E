import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs.recommended.rules,
      'playwright/no-commented-out-tests': 'warn',
      'playwright/no-skipped-test': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
    },
  },
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'artifacts/'],
  }
);
