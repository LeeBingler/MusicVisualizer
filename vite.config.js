import glsl from 'vite-plugin-glsl';

export default {
    root: 'src/',
    base: './',
    publicDir: '../public/',
    plugins: [glsl()],
    server: {
        host: true,
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    }
}
