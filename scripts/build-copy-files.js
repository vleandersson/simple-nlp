module.exports = (args, fs) => {
  // Copy files
  args.forEach(file => {
    copyFile(file.from, `./dist/${file.to || file.from}`);
  });

  function copyFile(fileName, distName) {
    fs.copyFile(fileName, distName, err => {
      if (err) throw err;
      console.log(`${fileName} was copied to ${distName}`);
    });
  }
};
