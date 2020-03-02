const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const copyFiles = require("./build-copy-files");

// TODO: Add cleaning stage, using CleanWebpackPlugin
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const success = msg => console.info("\x1b[32m", msg, "\x1b[0m");
const start = msg => console.info("\x1b[45m", msg, "\x1b[0m");
const error = msg => console.error("\x1b[31m", msg, "\x1b[0m");
const info = msg => console.info("\x1b[45m", msg, "\x1b[0m");

const ROOT_FOLDER = __dirname + `/..`;

async function buildEverything() {
  try {
    start("Build args");
    const args = buildArgs();
    success("Build args completed");

    if (!args || args.help) {
      return;
    }

    start("Setup env");
    setupEnv(args);
    success("Setup env completed");

    start("Checks started");
    await runChecks();
    success("Checks completed");

    start("Build started");
    await compilePackages();
    success("Build completed");

    start("Build package files from template");
    await buildPackageJson(args);
    success("Build package files from template completed");

    start("Write index files");
    await buildIndexFiles(args);
    success("Write index files completed");
  } catch (err) {
    error(err);
  }
}

function buildArgs() {
  const args = require("yargs")
    .alias({ P: "package", S: "semVar", H: "help" })
    .describe({
      P: "Choose package to build",
      S: "Semantic Versioning Specification"
    })
    .default({ P: "simple-nlp", S: "patch" })
    .choices({
      P: ["simple-nlp", "simple-nlp-sentiment"],
      S: ["patch", "minor", "major"]
    })
    .help().argv;

  info(args);

  return args;
}

function setupEnv({ package: packageName }) {
  process.env.packageName = packageName;
  process.env.webpackUmdConfigPath = `${ROOT_FOLDER}/configs/webpack.UMD.config.js`;
  process.env.webpackCjsConfigPath = `${ROOT_FOLDER}/configs/webpack.CJS.config.js`;
  process.env.context = `${ROOT_FOLDER}/packages/${packageName}`;
  process.env.outputPath = `${process.env.context}/dist`;
  process.env.umdOutputPath = `${process.env.outputPath}/umd`;
  process.env.commonJsOutputPath = `${process.env.outputPath}/cjs`;
}

async function runChecks() {
  return Promise.all([exec("yarn test"), exec("yarn check-types")]);
}

async function compilePackages() {
  const commonJsBuild = compileCommonJs();
  const umdBuild = compileUMD();

  return Promise.all([umdBuild, commonJsBuild]);
}

async function compileCommonJs() {
  info("Adding build for CommonJS");
  info(`Using CJS config ${process.env.webpackCjsConfigPath}`);
  return exec(
    `webpack --config ${process.env.webpackCjsConfigPath} --mode=production --context ${process.env.context} --output-path ${process.env.commonJsOutputPath}`
  );
}

async function compileUMD() {
  info("Adding build for UMD");
  info(`Using UMD config ${process.env.webpackUmdConfigPath}`);
  return exec(
    `webpack --config ${process.env.webpackUmdConfigPath} --mode=production --context ${process.env.context} --output-path ${process.env.umdOutputPath}`
  );
}

async function buildPackageJson({ package: packageName, semVar }) {
  let currentPackageVersion;

  try {
    const { stdout: pkgVr } = await exec(`npm view ${packageName} version`);

    currentPackageVersion = pkgVr.replace(/\r?\n|\r/g, "");
  } catch {
    currentPackageVersion = "0.0.0";
  }

  const nextNpmVersion = calculateNextPackageVersion(
    currentPackageVersion,
    semVar
  );

  let packageJson = {
    ...require(`${process.env.context}/package.json`)
  };

  info(`Next NPM version detected: ${nextNpmVersion}`);

  delete packageJson.devDependencies;
  packageJson = {
    ...packageJson,
    version: nextNpmVersion,
    files: ["README.md", `${process.env.packageName}.d.ts`, "umd/", "cjs/"],
    main: "./cjs/index.js",
    module: "./umd/index.js",
    types: `${process.env.packageName}.d.ts`
  };

  fs.writeFile(
    `${process.env.outputPath}/package.json`,
    JSON.stringify(packageJson),
    err => {
      if (err) {
        return error(err);
      }
    }
  );

  const files = [{ from: "README.md" }, { from: ".npmignore" }];
  await copyFiles(files, fs, process.env.outputPath);
}

async function buildIndexFiles({}) {
  // UMD bundle index
  fs.writeFile(
    `${process.env.outputPath}/umd/index.js`,
    `
    'use strict';

    if (process.env.NODE_ENV === 'production') {
      module.exports = require('./umd.production.min.js');
    } else {
      module.exports = require('./umd.development.js');
    }
    `,
    err => {
      if (err) {
        return error(err);
      }
    }
  );

  // CommonJs bundle index
  fs.writeFile(
    `${process.env.outputPath}/cjs/index.js`,
    `
    'use strict';

    if (process.env.NODE_ENV === 'production') {
      module.exports = require('./cjs.production.min.js');
    } else {
      module.exports = require('./cjs.development.js');
    }
    `,
    err => {
      if (err) {
        return error(err);
      }
    }
  );
}

function calculateNextPackageVersion(currentVersion, type) {
  const parts = currentVersion.split(".").map(v => parseInt(v));

  switch (type) {
    case "major":
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
      return parts.join(".");
    case "minor":
      parts[1] += 1;
      parts[2] = 0;
      return parts.join(".");
    case "patch":
    default:
      parts[2] += 1;
      return parts.join(".");
  }
}

buildEverything();
