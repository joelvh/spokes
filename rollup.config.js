import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import serve from 'rollup-plugin-serve';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';
import strip from 'rollup-plugin-strip';
import minify from 'rollup-plugin-babel-minify';
import gzipPlugin from 'rollup-plugin-gzip';
import hash from 'rollup-plugin-hash';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/demo.js',
  output: {
    name: 'spokes',
    file: 'build/rollup/js/demo.bundle.js',
    format: 'iife',
    sourcemap: true,
    sourcemapFile: 'build/rollup/js/demo.bundle.js.map',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    minify({
      comments: false,
      sourceMap: true,
    }),
    commonjs(),
    hash({ 
      dest: 'build/rollup/js/demo.bundle-[hash].js',
      replace: true
    }),
    sizeSnapshot(),
    visualizer({
      open: true, // open browser
      filename: './build/rollup/demo-stats.html',
      // sourcemap: true
    }),
    uglify({
      sourcemap: true,
      toplevel: true
    }),
    gzipPlugin(),
    serve({
      open: true, // open browser
      contentBase: ['public', 'build/rollup'],
      host: 'localhost',
      port: 8080
    })
  ]
};