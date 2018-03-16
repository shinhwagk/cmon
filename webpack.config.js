
const path = require('path');

const { CheckerPlugin } = require('awesome-typescript-loader')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './services/sql/src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'entrypoint.js'
  },
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'awesome-typescript-loader', options: { configFileName: 'tsconfig.service.query.json' } }]
  },
  externals: [
    nodeExternals()
  ]
};