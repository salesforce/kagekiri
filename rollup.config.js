import nodeResolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import buble from 'rollup-plugin-buble'
import { terser } from 'rollup-plugin-terser'

function config(output, plugins = []) {
  return {
    input: './index.js',
    output: {
      file: output,
      format: 'iife',
      name: 'kagekiri'
    },
    plugins: [
      nodeResolve(),
      cjs(),
      builtins(),
      globals(),
      buble({
        transforms: {
          dangerousForOf: true
        }
      }),
      ...plugins
    ]
  }
}

export default [
  config('dist/kagekiri.js'),
  config('dist/kagekiri.min.js', [terser()])
]
