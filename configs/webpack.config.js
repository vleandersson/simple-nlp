const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: { "simple-nlp": "./packages/simple-nlp/index.ts" },
  devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              happyPackMode: true
            }
          }
        ],
        exclude: /node_modules/
      },
      { test: /package.json/ }
    ]
  },
  target: "web",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  // plugins: [new CleanWebpackPlugin()],
  output: {
    filename: "umd/[name].production.min.js",
    path: path.resolve(__dirname, "../dist"),
    library: "",
    libraryTarget: "commonjs"
  }
};
