const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    "main.production": "./index.ts",
    "main.production.min": "./index.ts"
  },
  output: {
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devtool: "source-map",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: 4,
        sourceMap: true,
        include: /\.min\.js$/
      })
    ]
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              happyPackMode: true,
              declaration: false
            }
          }
        ],
        exclude: /node_modules/
      },
      { test: /package.json/ },
      { test: /\.json$/, loader: "json-loader" }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true
    })
  ],
  externals: {
    "simple-nlp": "simple-nlp",
    "simple-nlp-sentiment": "simple-nlp-sentiment"
  },
  target: "web"
};
