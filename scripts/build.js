const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const copyFiles = require("./build-copy-files");

const success = msg => console.info("\x1b[32m", msg, "\x1b[0m");
const start = msg => console.info("\x1b[45m", msg, "\x1b[0m");
const error = msg => console.error("\x1b[31m", msg, "\x1b[0m");
const info = msg => console.info("\x1b[45m", msg, "\x1b[0m");

const ROOT_FOLDER = __dirname + `/..`;

const DIST_FOLDER_NAME = "dist";
const COMMON_JS_FOLDER_NAME = "lib";
const ES6_FOLDER_NAME = "lib-esm";
const UMD_FOLDER_NAME = "bundles";

async function buildEverything() {
  try {
    start("Build args");
    const args = buildArgs();
    success("Build args completed");

    if (!args || args.help) {
      return;
    }

    // TODO: Make sure this does not build any types files
    // start("Checks started");
    // await runChecks();
    // success("Checks completed");

    start("Build started");
    await compilePackage(args.package);
    success("Build completed");

    start("Build package files from template");
    await buildPackageJson(args);
    success("Build package files from template completed");

    start("Write index files");
    await buildIndexFiles(args.package);
    success("Write index files completed");
  } catch (err) {
    error(err);
  }
}

function buildArgs() {
  const args = require("yargs")
    .alias({ P: "package", S: "semVar" })
    .describe({
      P: "Choose package to build",
      S: "Semantic Versioning Specification"
    })
    .default({ P: "simple-nlp", S: "patch" })
    .choices({
      P: ["simple-nlp", "simple-nlp-sentiment"],
      S: ["patch", "minor", "major"]
    })
    .help("H").argv;

  info(args);

  return args;
}

async function runChecks() {
  return Promise.all([exec("yarn test"), exec("yarn check-types")]);
}

async function compilePackage(packageName) {
  const umdBuild = compileUMD(packageName);

  return Promise.all([umdBuild]);
}

async function compileUMD(packageName) {
  const webpackConfigPath = `${__dirname}/../configs/webpack.config.js`;
  const context = `${ROOT_FOLDER}/packages/${packageName}`;

  info(`Using config ${webpackConfigPath}`);
  const build = await exec(
    `webpack --config ${webpackConfigPath} --mode=production --context ${context} --output-path ${context}/${DIST_FOLDER_NAME}`
  );
  console.log(build.stdout);
}

async function buildPackageJson({ package: packageName, semVar }) {
  const packageRootFolder = `${ROOT_FOLDER}/packages/${packageName}`;
  const distFolder = `${packageRootFolder}/${DIST_FOLDER_NAME}`;

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
    ...require(`${packageRootFolder}/package.json`)
  };

  info(`Next NPM version detected: ${nextNpmVersion}`);

  delete packageJson.devDependencies;
  packageJson = {
    ...packageJson,
    version: nextNpmVersion,
    files: ["README.md", "types/", "index.js", "index.d.ts", "bundle/"],
    main: "index.js",
    types: "index.d.ts"
  };

  fs.writeFile(
    `${distFolder}/package.json`,
    JSON.stringify(packageJson),
    err => {
      if (err) {
        return error(err);
      }
    }
  );

  const files = [{ from: "README.md" }, { from: ".npmignore" }];
  await copyFiles(files, fs, distFolder);
}

async function buildIndexFiles(packageName) {
  const packageRootFolder = `${ROOT_FOLDER}/packages/${packageName}`;

  // Types index
  fs.writeFile(
    `${packageRootFolder}/${DIST_FOLDER_NAME}/index.d.ts`,
    'export * from "./types/src";',
    err => {
      if (err) {
        return error(err);
      }
    }
  );

  // Bundle index
  fs.writeFile(
    `${packageRootFolder}/${DIST_FOLDER_NAME}/index.js`,
    'module.exports = require("./bundle/simple-nlp.production.min.js");',
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
