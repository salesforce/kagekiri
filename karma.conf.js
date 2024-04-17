/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
module.exports = function (config) {
  config.set({
    files: [
      { pattern: 'test/**/*.spec.js' }
    ],

    frameworks: ['mocha'],

    plugins: [
      require('karma-rollup-preprocessor'),
      require('karma-mocha'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      ...(process.env.COVERAGE ? [require('karma-coverage')] : [])
    ],

    reporters: [
      'progress',
      ...(process.env.COVERAGE ? ['coverage'] : [])
    ],

    preprocessors: {
      'test/**/*.spec.js': ['rollup']
    },

    ...(process.env.COVERAGE && {
      coverageReporter: {
        dir: 'coverage',
        reporters: [
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' },
          { type: 'text', subdir: 'report-text' }
        ],
        check: {
          global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
          }
        }
      }
    }),

    rollupPreprocessor: {
      plugins: [
        require('@rollup/plugin-node-resolve').default({
          mainFields: ['browser', 'module', 'main'],
          preferBuiltins: false
        }),
        require('@rollup/plugin-commonjs')(),
        require('rollup-plugin-node-globals')(),
        require('rollup-plugin-string').string({
          include: '**/*.html'
        }),
        ...(process.env.COVERAGE
          ? [require('rollup-plugin-istanbul')({
              exclude: ['**/test/**', '**/node_modules/**']
            })]
          : [])
      ],
      output: {
        format: 'iife', // Helps prevent naming collisions.
        name: 'Test', // Required for 'iife' format.
        sourcemap: 'inline' // Sensible for testing.
      }
    },

    browsers: [
      'ChromeHeadless',
      'FirefoxHeadless'
    ]

  })
}
