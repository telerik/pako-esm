import buble from '@rollup/plugin-buble';
import { terser } from 'rollup-plugin-terser';

export default [{
    // ESM2015 and SystemJS bundles
    input: 'lib/main.js',
    output: [{
        file: 'dist/pako-esm2015.js',
        format: 'esm'
    }, {
        file: 'dist/pako-system.js',
        format: 'systemjs'
    }],
    external: ['@progress/pako-esm']
}, {
    // UMD bundles
    input: 'lib/main.js',
    output: [{
        file: 'dist/pako.js',
        format: 'umd',
        name: 'pako'
    }, {
        file: 'dist/pako.min.js',
        format: 'umd',
        name: 'pako',
        plugins: [ terser() ]
    }],
    plugins: [ buble() ]
}, {
    // ESM5 bundle Buble
    input: 'lib/main.js',
    output: [{
        file: 'dist/pako-esm5.js',
        format: 'esm'
    }],
    plugins: [ buble() ],
    external: ['@progress/pako-esm']
}];
