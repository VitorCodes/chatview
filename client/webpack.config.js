const path = require('path')
const HTMLWebPackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    devServer: {
        contentBase: 'public',
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api/chat': {
                target: 'http://localhost:5000',
                pathRewrite: { '^/api': '' }
            },
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(ts|tsx)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                compileType: 'module',
                                localIdentName: '[hash:base64:8]'
                            },
                        }
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(jpg|png)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/img/'
                    }
                }]
            },
            {
                test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/svg/'
                    }
                }]
            },
            {
                test: /favicon\.ico$/,
                loader: 'url'
            },
            {
                test: /\.(woff(2)?|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: [
        new HTMLWebPackPlugin({
            template: './public/index.html'
        })
    ]
};