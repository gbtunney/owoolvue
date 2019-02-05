/* eslint-disable no-undef */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const isDevelopment = process.env.NODE_ENV === 'development';

function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    
    if (loader) {
        loaders.push({
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
                sourceMap: options.sourceMap
            })
        })
    }
    
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
        return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
        })
    } else {
        return ['vue-style-loader'].concat(loaders)
    }
}



const alias = {
    jQuery: path.resolve('./node_modules/jquery'),
    $: path.resolve('./node_modules/jquery'),
};

const part = {
    resolve: {
        alias,
        extensions: ['.js', '.css', '.json', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

const styleLoader = {
    loader: 'style-loader',
    options: {
        hmr: isDevelopment,
        includePaths: ["node_modules"]
    }
};

const cssLoader = {
    loader: 'css-loader',
    // Enabling sourcemaps in styles when using HMR causes style-loader to inject
    // styles using a <link> tag instead of <style> tag. This causes
    // a FOUC content, which can cause issues with JS that is reading
    // the DOM for styles (width, height, visibility) on page load.
    options: {        includePaths: ["node_modules"],
        sourceMap: !isDevelopment}
};

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        sourceMap: !isDevelopment
    }
};

module.exports = {
    'webpack.extend': config => {
        const postCssRule = {
            test: /\.pcss$/,
            exclude: config.get('webpack.commonExcludes')
        };

        postCssRule.use = [
            ...(isDevelopment ? [styleLoader] : [MiniCssExtractPlugin.loader]),
            cssLoader,
            postcssLoader
        ];
        part.module.rules.push(postCssRule);

        return part
    }
};
