const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js', // Your entry point
    output: {
        filename: 'bundle.js', // Output bundle file name
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    mode: 'development', // Set the mode (development or production)
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Match .js and .jsx files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/, // Match .css files
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve these extensions
        fallback: {
            "path": require.resolve("path-browserify"), // Polyfill for path
            "stream": require.resolve("stream-browserify"), // Polyfill for stream
            "crypto": require.resolve("crypto-browserify"), // Polyfill for crypto
            "util": require.resolve("util/"), // Polyfill for util
            "url": require.resolve("url/"), // Polyfill for url
            // Set to false if you don't need these modules
            "buffer": false,
            "http": false,
            "https": false,
            "os": false,
            "zlib": false,
            "vm": false,
            "querystring": false,
            "assert": false,
            "async_hooks": false,
            "child_process": false,
            "cluster": false,
            "fs": false,
            "net": false,
            "readline": false,
            "repl": false,
        },
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^express$/, // Ignore express if not needed in the browser
        }),
    ],
};
