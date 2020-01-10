const util = require("util");
const exec = util.promisify(require("child_process").exec);

const info = msg => console.info("\x1b[45m", msg, "\x1b[0m");

const ROOT_FOLDER = __dirname + `/..`;
const DIST_FOLDER_NAME = "dist";

async function publishPackage() {
  const args = getArgs();

  if (!args) {
    return;
  }

  if (!args.package) {
    throw new Error(
      "Publishing requires a given package. Please use -P or --package flag to define a package"
    );
  }

  const distFolder = `${ROOT_FOLDER}/packages/${args.package}/${DIST_FOLDER_NAME}`;
  info(`Publishing: ${distFolder}`);

  const publishProcess = await exec(
    `npm publish ${distFolder} --access=public`
  );
  console.log(publishProcess.stdout);
}

function getArgs() {
  const args = require("yargs")
    .alias({ P: "package" })
    .describe({
      P: "Choose package to publish"
    })
    .choices({
      P: ["simple-nlp", "simple-nlp-sentiment"]
    })
    .help("H").argv;

  info(args);

  return args;
}

publishPackage();
