/**
 * This file is part of the Translate.
 * @author William Chan <root@williamchan.me>
 */
const typescript = require('rollup-plugin-typescript');

module.exports = {
  input: 'lib/main.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs', // 'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
  },
  plugins: [
    typescript(),
  ],
}
