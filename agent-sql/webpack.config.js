const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: './dist/entrypoint.js'
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  },
  externals: [nodeExternals()],
};