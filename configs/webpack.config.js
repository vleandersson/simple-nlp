const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: {
    "main.development": "./index.ts",
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
  target: "web",

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
                outDir: "./dist/types"
              }
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
