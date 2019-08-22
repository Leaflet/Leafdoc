
// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
// import builtins from 'rollup-plugin-node-builtins';
// import globals from 'rollup-plugin-node-globals';
// import buble from 'rollup-plugin-buble';
// import eslint from 'rollup-plugin-eslint';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

// TODO eslint needs to be configured for TypeScript

export default [
    // browser-friendly UMD build
    {
        input: pkg.module,
        output: {
            file: pkg.browser,
            format: 'iife',
            sourcemap: true,
            name: 'leafdoc'
        },
        plugins: [
//             eslint(),
            // buble(),
            typescript(),
//             resolve(), // so Rollup can find `crc32`
//             commonjs(),
//             builtins(),
//             globals()
        ],
        external: ['sander', 'path']
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // the `targets` option which can specify `dest` and `format`)
    {
        input: pkg.module,
//         external: ['buffer', 'fs', 'jszip', 'debug'],
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true },
//             { file: pkg.module, format: 'es', sourcemap: true }
        ],
        plugins: [
            // eslint(),
            // buble(),
            typescript(),
//             resolve(), // so Rollup can find `crc32`
// 			commonjs() // so Rollup can convert `crc32` to an ES module
        ],
        external: ['sander', 'path']
    },
    
    
    // Experimental code-splitting build, for exposing all modules (for unit testing)
    // TODO, the output files in dist/split end with .ts.js for some reason. How
    // do we configure them to end only with .js?
    {
        input: [pkg.module, 'src/parsers/c-like.ts', 'src/parsers/trivial.ts'],
        experimentalCodeSplitting: true,
        experimentalDynamicImport: true,
        output: {
            dir: 'dist/split',
            format: 'cjs'
        },
        plugins: [
            // eslint(),
            // buble(),
            typescript(),
//             resolve(), // so Rollup can find `crc32`
// 			commonjs() // so Rollup can convert `crc32` to an ES module
        ],
        external: ['sander', 'path']
    }
];
