/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
module.exports = function (config) {
  config.set({
    files: [
      'test/test.js'
    ],

    frameworks: ['mocha'],

    plugins: [
      require('karma-rollup-preprocessor'),
      require('karma-mocha'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher')
    ],

    preprocessors: {
      'test/test.js': ['rollup']
    },

    rollupPreprocessor: {
      plugins: [
        require('rollup-plugin-node-resolve')({
          mainFields: ['browser', 'module', 'main'],
          preferBuiltins: false
        }),
        require('rollup-plugin-commonjs')(),
        require('rollup-plugin-node-globals')(),
        require('rollup-plugin-string').string({
          include: '**/*.html'
        })
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
