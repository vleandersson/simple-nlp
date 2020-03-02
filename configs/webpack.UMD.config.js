const merge = require("webpack-merge");
const { baseConfig } = require("./webpack.base.config");
const DtsBundleWebpack = require("dts-bundle-webpack");

module.exports = merge(baseConfig, {
  entry: {
    "umd.development": "./index.ts",
    "umd.production.min": "./index.ts"
  },
  target: "web",
  output: {
    libraryTarget: "umd2",
    umdNamedDefine: true
  },
  plugins: [
    new DtsBundleWebpack({
      name: process.env.packageName,
      main: `${process.env.outputPath}/index.d.ts`,
      removeSource: true
    })
  ]
});
