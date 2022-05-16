const path = require('path');

const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'app': './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    //library: '[name]_ExportedModule',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'static'), to: path.resolve(__dirname, 'dist') },
      ],
    }),
  ],
  optimization: {
    chunkIds: 'size',
    moduleIds: 'deterministic',
    concatenateModules: true,
    mangleWasmImports: true,
    mergeDuplicateChunks: false,
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

