var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: './src/index.tsx',

  output: {
    publicPath: './build/',
    filename: 'bundle.js',
    path: __dirname + '/build'
  },

  devtool: 'source-map',

  target: 'web',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      { from: '../tedword-client/build/bundle.js', to: '../../tedword/public/build' },
      { from: '../tedword-client/build/bundle.js.map', to: '../../tedword/public/build' },
    ]),
  ]
};
//       { from: './build/bundle.js', to: '../../tedword/public/build' },
