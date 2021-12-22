const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
    HtmlWebpackSkipAssetsPlugin,
} = require('html-webpack-skip-assets-plugin');
// const { ESBuildPlugin } = require('esbuild-loader')

const fileExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'eot',
    'otf',
    'svg',
    'ttf',
    'woff',
    'woff2',
];

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        popup: './src/index.tsx',
        background: './src/middleware/background.ts',
        content: './src/middleware/content.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    resolve: {
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        extensions: ['.tsx', '.ts', '.js', '.json'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, './tsconfig.json'),
            }),
        ],
    },
    target: 'node',
    module: {
        rules: [
            // {
            //     test: /\.tsx?$/,
            //     exclude: /node_modules/,
            //     loader: 'babel-loader'
            // },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            // {
            //     test: /\.tsx?$/,
            //     loader: 'esbuild-loader',
            //     options: {
            //         loader: 'tsx',
            //         target: 'es2015'
            //     }
            // },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: true },
                    },
                ],
            },
            {
                test: new RegExp(`.(${fileExtensions.join('|')})$`),
                exclude: /node_modules/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: './dist',
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ]
    },
    plugins: [
        // new ESBuildPlugin(),
        new HtmlWebPackPlugin({
            inject: true,
            template: './public/index.html',
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackSkipAssetsPlugin({
            excludeAssets: ['background.bundle.js', 'content.bundle.js'],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public/manifest.json',
                    transform(content, _path) {
                        return Buffer.from(
                            JSON.stringify({
                                ...JSON.parse(content.toString()),
                            }),
                        );
                    },
                },
                { from: './public/logo512.png' },
                { from: './public/logo192.png' },
                { from: './public/favicon.ico' },
            ],
        }),
    ],
};
