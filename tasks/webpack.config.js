const nodeExternals = require("webpack-node-externals");

module.exports = env => {

  const taskName = env.task

  return {
    entry: "./src/${taskName}.ts",
    output: {
      filename: "./entrypoint.js"
    },
    target: "node",
    resolve: {
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [{ test: /\.ts$/, loader: "awesome-typescript-loader" }]
    }
    , externals: [nodeExternals({ whitelist: ["tasks"] })]
  }
};