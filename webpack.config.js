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
    extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
    fallback: {
      'fs': false,
      'tls': false,
      'net': false,
      'path': false,
      'zlib': false,
      'http': false,
      'https': false,
      'stream': false,
      'crypto': false,
      'buffer': require.resolve('buffer'),
      'crypto-browserify': require.resolve('crypto-browserify'),
    }
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
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new CopyWebpackPlugin([
      { from: '../tedword-client/build/bundle.js', to: '../../tedword/public/build' },
      { from: '../tedword-client/build/bundle.js.map', to: '../../tedword/public/build' },
    ]),
  ]
};
//       { from: './build/bundle.js', to: '../../tedword/public/build' },
