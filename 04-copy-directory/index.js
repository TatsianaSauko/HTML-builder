const fs = require('fs');
const path = require('path');
let folderPath = path.join(__dirname, 'files');
let folderCopy = path.join(__dirname, 'files-copy');
const copyFiles = (files) => {
  files.forEach(file => {
    fs.copyFile(path.join(folderPath, file.name), path.join(folderCopy, file.name), (err) => {
      if (err) throw err;
    });
  });
};
const creatFolder = (files) => {
  fs.mkdir(folderCopy, { recursive: true }, err => {
    if(err) throw err;
    copyFiles(files);
  });
};
const readFolder = () => {
  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    creatFolder(files);

  });
};
const checkFolderCreating = () => {
  fs.stat(folderCopy, (err) => {
    if (!err) {
      fs.rm(folderCopy, { recursive: true },err => {
        if(err) throw err;
        readFolder();
      });
    }
    else if (err.code === 'ENOENT') {
      readFolder();
    }
  });
};

const copyDir = () => {
  checkFolderCreating();
};

copyDir();
