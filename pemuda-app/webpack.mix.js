const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/js/src/main.tsx', 'public/js', {
    transpileOnly: true
})
    .react()
    .postCss('resources/css/app.css', 'public/css', [
        require('@tailwindcss/postcss'),
    ])
    .webpackConfig({
        plugins: [
            new (require('webpack').DefinePlugin)({
                'process.env.REACT_APP_API_BASE_URL': JSON.stringify('/pemudaberprestasi/api/v1'),
                'import.meta.env.VITE_API_URL': JSON.stringify('/pemudaberprestasi/api/v1')
            })
        ]
    })
    .setResourceRoot('/pemudaberprestasi/')
    .setPublicPath('public');

mix.webpackConfig({
    output: {
        publicPath: '/pemudaberprestasi/',
    }
});
