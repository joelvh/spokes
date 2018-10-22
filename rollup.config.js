import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import serve from 'rollup-plugin-serve';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import visualizer from 'rollup-plugin-visualizer';

export default {
  input: 'src/demo.js',
  output: {
    file: 'build/rollup/js/demo.bundle.js',
    format: 'iife'
  },
  name: 'spokes',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
    sizeSnapshot(),
    visualizer({
      open: true, // open browser
      filename: './build/rollup/statistics.html',
      // sourcemap: true
    }),
    uglify({
      sourcemap: true,
      toplevel: true
    }),
    serve({
      open: true, // open browser
      contentBase: ['public', 'build/rollup'],
      host: 'localhost',
      port: 8080
    })
  ]
};