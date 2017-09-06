const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/app.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    devtool: 'source-map',

    devServer: {
        contentBase: './dist'
    },

    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader",
            })
        }, {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: './assets/'
                }
            }]
        }]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),

        new ExtractTextPlugin({
            filename: 'style.[contenthash].css'
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'Fabric Editor'
        }),
    ]
}