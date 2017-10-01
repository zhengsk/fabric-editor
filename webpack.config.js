const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/index.js',

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },

    devtool: 'source-map',

    devServer: {
        contentBase: './dist'
    },

    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },

    module: {
        exprContextCritical: false,

        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: ['transform-runtime'],
                },
            }
        }, {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: './assets/',
                }
            }]
        }, {
            test: /\.(s)?css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader",
                }, {
                    loader: "sass-loader",
                }],
            })
        }]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),

        new ExtractTextPlugin({
            filename: './style/[name].[contenthash].css'
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'Fabric Editor'
        }),
    ]
}