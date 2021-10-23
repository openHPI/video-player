import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';

// Taken from: https://lit-element.polymer-project.org/guide/build#building-with-rollup
const es6_config = {
  input: 'video-player.js',
  output: {
    dir: 'build',
    format: 'iife', // TODO: try es?
  },
  plugins: [
    minifyHTML(),
    resolve({mainFields: ['module', 'jsnext:main']}),
    terser(),
  ],
  preserveEntrySignatures: false,
};

export default es6_config;
