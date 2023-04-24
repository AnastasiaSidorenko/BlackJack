const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'game.bundle.js'
    },
    devServer: {
        compress: true,
        port: 9000
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
               //  options: {configFile: 'tsconfig.webpack.json'} 
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },
    devtool: "source-map",
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
            ],
        }),
        new HtmlWebpackPlugin({
            title: "Your custom title",
            template: './index.html'
        })
        // new HtmlWebpackPlugin()
    ]
};
