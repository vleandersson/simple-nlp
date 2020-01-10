const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const copyFiles = require("./build-copy-files");

const success = msg => console.info("\x1b[32m", msg, "\x1b[0m");
const start = msg => console.info("\x1b[45m", msg, "\x1b[0m");
const error = msg => console.error("\x1b[31m", msg, "\x1b[0m");
const info = msg => console.info("\x1b[45m", msg, "\x1b[0m");

const DIST_FOLDER = __dirname + `/../dist`;

run();

async function run() {
  try {
    start("Build args");
    const args = buildArgs();
    success("Build args completed");

    if (!args || args.help) {
      return;
    }

    start("Checks started");
    await runChecks();
    success("Checks completed");

    start("Build started");
    await runBuild(args.package);
    success("Build completed");

    start("Build package files from template");
    await runBuildPackage(args.package);
    success("Build package files from template completed");

    start("Write index files");
    await writeIndexFiles();
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
  await Promise.all([exec("yarn test"), exec("yarn check-types")]);
}

async function runBuild(packageName) {
  const webpackConfigPath = `${__dirname}/../configs/webpack.config.js`;
  const context = `${__dirname}/../packages/${packageName}`;

  info(`Using config ${webpackConfigPath}`);
  const build = await exec(
    `webpack --config ${webpackConfigPath} --mode=production --context ${context}`
  );
  console.log(build.stdout);
}

async function runBuildPackage(packageName) {
  let currentPackageVersion;

  try {
    const { stdout: pkgVr } = await exec(
      `npm view ${packageName || "simple-nlp"} version`
    );

    currentPackageVersion = pkgVr.replace(/\r?\n|\r/g, "");
  } catch {
    currentPackageVersion = "0.0.0";
  }

  const nextNpmVersion = stepUpVersion(currentPackageVersion);

  let packageJson = {
    ...require(__dirname +
      `/../packages/${packageName || "simple-nlp"}/package.json`)
  };

  info(`Next NPM version detected: ${nextNpmVersion}`);

  delete packageJson.devDependencies;
  packageJson = {
    ...packageJson,
    version: nextNpmVersion,
    files: ["README.md", "types/", "index.js", "index.d.ts", "umd/"],
    main: "index.js",
    types: "index.d.ts"
  };

  fs.writeFile(
    `${DIST_FOLDER}/package.json`,
    JSON.stringify(packageJson),
    err => {
      if (err) {
        return error(err);
      }
    }
  );

  const files = [{ from: "README.md" }, { from: ".npmignore" }];
  await copyFiles(files, fs);
}

async function writeIndexFiles() {
  // Types index
  fs.writeFile(
    `${DIST_FOLDER}/index.d.ts`,
    'export * from "./types/src";',
    err => {
      if (err) {
        return error(err);
      }
    }
  );

  // Umd index
  fs.writeFile(
    `${DIST_FOLDER}/index.js`,
    'module.exports = require("./umd/simple-nlp.production.min.js");',
    err => {
      if (err) {
        return error(err);
      }
    }
  );
}

function stepUpVersion(currentVersion, type) {
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
