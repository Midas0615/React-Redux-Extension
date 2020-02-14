/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';

const isLan = process.env.NETWORK === 'lan';
const isProduction = process.env.NODE_ENV === 'production';
const copyFiles = [
  { from: './resources/icons', to: 'icons' },
  { from: './resources/images', to: 'images' },
  { from: './src/popup/index.html' },
  // { from: './node_modules/injector/dist/injector-chrome.js' },
];

if (isProduction) {
  if (isLan) {
    copyFiles.push({ from: './resources/manifest.lan.json', to: 'manifest.json' });
  } else {
    copyFiles.push({ from: './resources/manifest.json' });
  }
} else {
  // copyFiles.push({ from: './node_modules/injector/dist/injector-chrome.js.map' });
  if (isLan) {
    copyFiles.push({ from: './resources/manifest.lan.json', to: 'manifest.json' });
  } else {
    copyFiles.push({ from: './resources/manifest.dev.json', to: 'manifest.json' });
  }
}

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      API_URL: JSON.stringify(process.env.API_URL),
    },
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new CleanWebpackPlugin(['dist']),
  new CopyWebpackPlugin(copyFiles),
  new StyleLintPlugin({ files: './src/**/*.scss' }),
];

if (isProduction) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  );
}

export default {
  debug: !isProduction,
  noInfo: true,
  devtool: isProduction ? false : 'source-map',
  target: 'web',
  watchOptions: {
    ignored: /node_modules/,
  },
  entry: {
    background: './src/background/index.js',
    popup: './src/popup/index.js',
  },
  output: {
    path: './dist/',
    filename: '[name].js',
  },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    preLoaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loaders: ['eslint'],
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        exclude: /(node_modules)/,
        loader: 'html-loader',
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        loaders: ['style', 'css', 'sass?sourceMap'],
      },
      {
        test: /\.json/,
        loader: 'json-loader',
      },
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins,
};
