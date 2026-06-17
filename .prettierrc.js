module.exports = {
  // Basic Prettier options
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,

  // Plugins
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss', // Keep your existing Tailwind plugin
  ],

  // Import sorting configuration
  importOrder: [
    // Angular core imports first
    '^@angular/(.*)$',

    // RxJS imports
    '^rxjs/(.*)$',
    '^rxjs$',

    // Third-party libraries
    '^[a-zA-Z]',

    // All internal imports with @ aliases (grouped together)
    '^@(commands|guards|services|storage|pipes|types|utils|widgets|features|directives|mappers)/(.*)$',
    '^@(commands|guards|services|storage|pipes|types|utils|widgets|features|directives|mappers)$',

    // Other @ imports
    '^@/(.*)$',
    '^@(.*)$',

    // Relative imports
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
};
