const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DtsBundleWebpack = require("dts-bundle-webpack");
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
    extensions: [".tsx", ".ts", ".js", ".json"]
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
    new CleanWebpackPlugin({
      verbose: true
    }),
    new DtsBundleWebpack({
      name: process.env.packageName,
      main: `${process.env.outputPath}/index.d.ts`,
      removeSource: true
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
