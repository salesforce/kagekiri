module.exports = function (config) {
  config.set({
    files: [
      'test/test.js'
    ],

    frameworks: ['mocha'],

    plugins: [
      require('karma-rollup-preprocessor'),
      require('karma-mocha'),
      require('karma-chrome-launcher')
    ],

    preprocessors: {
      'test/test.js': ['rollup']
    },

    rollupPreprocessor: {
      plugins: [
        require('rollup-plugin-node-resolve')({ preferBuiltins: true }),
        require('rollup-plugin-commonjs')(),
        require('rollup-plugin-node-builtins')(),
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
      'ChromeHeadless'
    ]

  })
}
