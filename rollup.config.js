// @ts-check

import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';

const isProd = !process.env.ROLLUP_WATCH;
const input = ['src/index.ts'];
const pluginFn = (isIife = false) => [
  isProd && tslint({
    throwError: true,
    configuration: `tslint${isProd ? '.prod' : ''}.json`,
  }),
  typescript({ tsconfig: `./tsconfig${isIife ? '.iife' : ''}.json` }),
  commonjs({
    include: [
      'node_modules/lodash/**',
      'node_modules/lodash.clonedeep/**',
    ],
    extensions: ['.js', '.ts'],
  }),
  isProd && terser(),
  isProd && filesize({ showBrotliSize: true }),
];

const multiBuild = [
  {
    file: 'dist/index.js',
    format: 'esm',
  },
  {
    file: 'dist/index.cjs.js',
    format: 'cjs',
  },
  {
    file: 'dist/index.iife.js',
    format: 'iife',
    name: 'DeepClone',
  },
].map(n => ({ input, output: n, plugins: pluginFn(n.format === 'iife') }));

export default multiBuild;
