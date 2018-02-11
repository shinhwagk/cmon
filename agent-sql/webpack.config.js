const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './dist/httpserver.js',
  output: {
    filename: './entrypoint.js'
  },
  target: 'node',
  externals: [nodeExternals()],
};