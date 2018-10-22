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

const entryName = process.env.ENTRY || 'main';
const openBrowser = process.env.OPEN === 'true';

export default {
  input: 'src/loaders/'+entryName+'.js',
  output: {
    name: 'spokes',
    file: 'build/rollup/js/'+entryName+'.bundle.js',
    format: 'iife',
    sourcemap: true,
    sourcemapFile: 'build/rollup/js/'+entryName+'.bundle.js.map',
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
      dest: 'build/rollup/js/'+entryName+'.bundle-[hash].js',
      replace: false
    }),
    sizeSnapshot(),
    uglify({
      sourcemap: true,
      toplevel: true
    }),
    gzipPlugin(),
    openBrowser && serve({
      open: true, // open browser
      contentBase: ['public', 'build/rollup'],
      host: 'localhost',
      port: 8080
    })
  ]
};