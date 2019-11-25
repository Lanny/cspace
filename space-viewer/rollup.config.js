import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import resolve from 'rollup-plugin-node-resolve'

const config = {
  input: 'src/main/main.js',
  output: {
    file: '../cspace/static/js/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    babel(),
    commonjs(),
    globals()
  ]
}

export default config
