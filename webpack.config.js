const path = require ('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const BUILD_DIR = path.join(__dirname, '/client/dist');
const APP_DIR = path.join(__dirname, '/client/src');

module.exports = {
  mode: "development",
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              includePaths: ['./node_modules', './node_modules/antd'],
            },
          },
          {
            loader: 'less-loader',
            options: {
              includePaths: ['./node_modules', './node_modules/antd'],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              includePaths: ['./node_modules', './node_modules/antd'],
            },
          },
          {
            loader: 'less-loader',
            options: {
              includePaths: ['./node_modules', './node_modules/antd'],
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  }
};
