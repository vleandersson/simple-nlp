const path = require("path");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: { main: "./index.ts" },
  devtool: "source-map",
  mode: "production",
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
      { test: /package.json/ },
      { test: /\.json$/, loader: "json-loader" }
    ]
  },
  externals: {
    "simple-nlp": "simple-nlp",
    "simple-nlp-sentiment": "simple-nlp-sentiment"
  },
  target: "web",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  // plugins: [new CleanWebpackPlugin()],
  output: {
    filename: "bundle/[name].production.min.js",
    library: "[name]",
    libraryTarget: "umd"
  }
};
