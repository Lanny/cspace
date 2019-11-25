import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

const config = {
  input: 'src/main/main.js',
  output: {
    file: '../cspace/static/js/bundle.js',
    format: 'cjs'
  },
  external: [
    'react',
    'react-proptypes'
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

export default config
