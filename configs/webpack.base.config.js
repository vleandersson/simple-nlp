// const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const baseConfig = {
  output: {
    filename: "[name].js",
    library: "[name]"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"]
  },
  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: false,
              configFile: "./tsconfig.json",
              // experimentalWatchApi: true,
              // happyPackMode: true
              compilerOptions: {
                outDir: "./dist"
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      { test: /package.json/ }
    ]
  },

  plugins: [
    // new ForkTsCheckerWebpackPlugin({ eslint: true }) // Only prod
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: 4,
        sourceMap: false,
        include: /\.min\.js$/
      })
    ]
  },

  externals: {
    "simple-nlp": "simple-nlp",
    "simple-nlp-sentiment": "simple-nlp-sentiment"
  }
};

module.exports = { baseConfig };
