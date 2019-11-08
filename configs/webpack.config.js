const path = require("path");

module.exports = {
  entry: { "simple-nlp": __dirname + "./packages/simple-nlp/index.ts" },
  devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      { test: /package.json/ }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "umd/[name].production.min.js",
    path: path.resolve(__dirname, "../dist"),
    library: "",
    libraryTarget: "commonjs"
  }
};
