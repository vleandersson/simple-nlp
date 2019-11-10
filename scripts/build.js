const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
var copyFiles = require("./build-copy-files");

const success = msg => console.info("\x1b[32m", msg, "\x1b[0m");
const start = msg => console.info("\x1b[45m", msg, "\x1b[0m");
const error = msg => console.error("\x1b[31m", msg, "\x1b[0m");

const DIST_FOLDER = __dirname + `/../dist`;

// Get package args
// args = [];
// process.argv.forEach(function(val) {
//   args.push(val);
// });
// args.splice(0, 2);

run();

async function run(packageName) {
  try {
    start("Checks started");
    await runChecks();
    success("Checks completed");

    start("Build started");
    await runBuild();
    success("Build completed");

    start("Build package files from template");
    await runBuildPackage(packageName);
    success("Build package files from template completed");

    start("Write index files");
    await writeIndexFiles();
    success("Write index files completed");
  } catch (err) {
    error(err);
  }
}

async function runChecks() {
  await Promise.all([exec("yarn test"), exec("yarn check-types")]);
}

async function runBuild() {
  const build = await exec(
    "webpack --config configs/webpack.config.js --mode=production"
  );
  console.log(build.stdout);
}

async function runBuildPackage(packageName) {
  const { stdout: pkgVr } = await exec(
    `npm view ${packageName || "simple-nlp"} version`
  );

  const currentPackageVersion = pkgVr.replace(/\r?\n|\r/g, "");

  let packageJson = {
    ...require(__dirname +
      `/../packages/${packageName || "simple-nlp"}/package.json`)
  };

  delete packageJson.devDependencies;
  packageJson = {
    ...packageJson,
    version: stepUpVersion(currentPackageVersion),
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
