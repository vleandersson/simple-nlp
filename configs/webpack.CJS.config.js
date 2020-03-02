const merge = require("webpack-merge");
const { baseConfig } = require("./webpack.base.config");

module.exports = merge(baseConfig, {
  entry: {
    "cjs.development": "./index.ts",
    "cjs.production.min": "./index.ts"
  },
  target: "node",
  output: {
    libraryTarget: "commonjs2"
  }
});
