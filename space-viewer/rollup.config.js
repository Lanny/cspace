import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins';

const config = {
  input: 'src/main/main.js',
  output: {
    file: '../cspace/static/js/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    babel(),
    commonjs({
      namedExports: {
        'node_modules/react/index.js': ['Component', 'cloneElement', 'createContext', 'createElement', 'useState', 'useRef', 'useLayoutEffect', 'useMemo', 'useEffect', 'forwardRef', 'useContext', 'Children' ],
        'node_modules/react-is/index.js': [ 'isValidElementType', 'isElement', 'ForwardRef' ],
        'node_modules/react-dom/index.js': [ 'render' ]
        }
    }),
    globals(),
    builtins(),
  ]
}

export default config
