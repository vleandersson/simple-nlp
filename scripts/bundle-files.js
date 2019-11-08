const fs = require("fs");

var copyFiles = require("./build-copy-files");

// Get package args
// args = [];
// process.argv.forEach(function(val) {
//   args.push(val);
// });
// args.splice(0, 2);

var files = [
  { from: "README.md" },
  { from: ".npmignore" }
  // { from: "packages/simple-nlp/package.json", to: "package.json" }
];
copyFiles(files, fs);
