/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path'
import nodeResolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import buble from '@rollup/plugin-buble'
import { terser } from 'rollup-plugin-terser'
import inject from '@rollup/plugin-inject'

// Note that postcss-selector-parser is bundled into all outputs because its deps (util.promisify)
// cause problems depending on the consumer's bundler. We can make things simpler for consumers of
// kagekiri by just bundling our dependencies. (Polyfills are also bundled.)
const name = 'kagekiri'
export default {
  input: './src/index.js',
  output: [{
    file: 'dist/kagekiri.umd.js',
    format: 'umd',
    name
  },
  {
    file: 'dist/kagekiri.umd.min.js',
    format: 'umd',
    name,
    plugins: [terser()]
  },
  {
    file: 'dist/kagekiri.cjs.js',
    format: 'cjs',
    name
  },
  {
    file: 'dist/kagekiri.es.js',
    format: 'es',
    name
  },
  {
    file: 'dist/kagekiri.iife.js',
    format: 'iife',
    name
  },
  {
    file: 'dist/kagekiri.iife.min.js',
    format: 'iife',
    name,
    plugins: [terser()]
  }],
  plugins: [
    nodeResolve({
      mainFields: ['browser', 'module', 'main'],
      preferBuiltins: false
    }),
    cjs(),
    globals(),
    buble({
      transforms: {
        dangerousForOf: true
      }
    }),
    inject({
      'Object.assign': path.resolve('node_modules/object-assign'),
      exclude: 'node_modules/object-assign/**'
    })
  ]
}
