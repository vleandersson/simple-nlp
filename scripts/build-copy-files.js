module.exports = async (args, fs, distFolder) => {
  // Copy files
  args.forEach(file => {
    copyFile(file.from, `${distFolder}/${file.to || file.from}`);
  });

  function copyFile(fileName, distName) {
    fs.copyFile(fileName, distName, err => {
      if (err) throw err;
      console.log(`${fileName} was copied to ${distName}`);
    });
  }
};
