const path = require("path");
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
    entry: {
        web: path.join(__dirname, "src/index.web.ts"),
    },
    mode: 'development',
    target: "node",
    output: {
        path: path.join(__dirname, "./build"),
        filename: "web.bundle.js",
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules:[
            {
                test: /\.ts?$/,
                loader: "ts-loader",
                exclude: '/node_modules/'
            },
        ]
    },
    devtool: 'inline-source-map',
    externals: [nodeExternals()]
};
