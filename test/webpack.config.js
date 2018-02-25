const nodeExternals = require('webpack-node-externals');

module.exports = env => {

  const taskName = env.task

  return {
    entry: `./src/${taskName}.ts`,
    output: {
      filename: './dist/entrypoint.js'
    },
    target: 'node',
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      loaders: [{ test: /\.ts$/, loader: 'awesome-typescript-loader' }]
    },
    externals: [nodeExternals()],
  }
};