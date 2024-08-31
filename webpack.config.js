const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loader = require('sass-loader');

module.exports = {
	entry: './src/index.tsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.scss$/,  // Handle SCSS files
				use: [
					process.env.NODE_ENV !== 'production'
						? 'style-loader'
						: MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: {
								exportLocalsConvention: 'camelCase',  // Export class names in camelCase
							}
						},
					},
					{
						loader: 'sass-loader',
						options: {
							additionalData: `@import "${path.resolve(__dirname, 'src/theme.css')}";`,  // Automatically import theme.css in SCSS files
						},
					},
				],
			},
			{
				test: /\.(css)$/,
				use: [
					process.env.NODE_ENV !== 'production'
						? 'style-loader'
						: MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	],
};
