const fs = require('fs');
const path = require('path');
let folderProject = path.join(__dirname, 'project-dist');
let folderStyles = path.join(__dirname, 'styles');
let fileTemplate = path.join(__dirname, 'template.html');
let fileProjectIndex = path.join(folderProject, 'index.html');
let fileProjectStyle = path.join(folderProject, 'style.css');
let folderAssets = path.join(__dirname, 'assets');
let folderProjectAssets = path.join(folderProject, 'assets');
let folderComponents = path.join(__dirname, 'components');

const copyFiles = (folders) => {
  folders.forEach(folder => {
    fs.mkdir(path.join(folderProjectAssets, folder.name), { recursive: true }, err => {
      if(err) throw err;
      fs.readdir(path.join(folderAssets, folder.name), { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
          fs.copyFile(path.join(path.join(folderAssets, folder.name), file.name), path.join(path.join(folderProjectAssets, folder.name), file.name), (err) => {
            if (err) throw err;
          });
        });
      });
    });
  });
};

const createFileProjectStyle = () => {
  fs.writeFile(fileProjectStyle, '', (err) => {
    if (err) return console.error(err.message);
  });
};
const createBundleCss = () => {
  createFileProjectStyle();
  fs.readFile(fileProjectStyle, (err) => {
    if (err) return console.error(err.message);
    let data = '';
    fs.readdir(folderStyles, {withFileTypes: true}, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        if(file.isFile() && path.extname(file.name) === '.css'){
          const rs = fs.createReadStream(path.join(folderStyles, file.name), 'utf-8');
          rs.on('data', (chunk) => {
            data += chunk.toString();
          });
          rs.on('end', () => {
            fs.writeFile(fileProjectStyle, data, (error) => {
              if (error) return console.error(error.message);
            });
          });
        }
      });
    });
  });
};

const readComponents = (dataTemplate) => {
  let dataTemplateCopy = dataTemplate;
  fs.readdir(folderComponents, {withFileTypes: true}, (err, components) => {
    if (err) throw err;
    components.forEach((component, ind) => {
      const rs = fs.createReadStream(path.join(folderComponents, component.name), 'utf-8');
      let data = '';
      rs.on('data', (chunk) => {
        data += chunk.toString();
      });
      rs.on('end', () => {
        let fileName = component.name.split('.')[0];
        dataTemplateCopy = dataTemplateCopy.replace(`{{${fileName}}}`, data);
        if (ind === components.length - 1) {
          fs.writeFile(fileProjectIndex, dataTemplateCopy, (error) => {
            if (error) return console.error(error.message);
          });
        }
      });
    });
  });
};
const changeComponents = () => {
  fs.readFile(fileProjectIndex, (err) => {
    if (err) return console.error(err.message);
    let data = '';
    const rs = fs.createReadStream(fileTemplate, 'utf-8');
    rs.on('data', (chunk) => {
      data += chunk.toString();
    });
    rs.on('end', () => {
      readComponents(data);
    });
  });
};

const createFileIndex = () => {
  fs.writeFile(fileProjectIndex, '', (err) => {
    if (err) return console.error(err.message);
    changeComponents();
  });
};
const creatFolder = (folders) => {
  fs.mkdir(folderProject, { recursive: true }, err => {
    if(err) throw err;
    fs.mkdir(folderProjectAssets, { recursive: true }, err => {
      if(err) throw err;
      copyFiles(folders);
      createBundleCss();
      createFileIndex();
    });
  });
};
const readFolder = () => {
  fs.readdir(folderAssets, { withFileTypes: true }, (err, folders) => {
    if (err) throw err;
    creatFolder(folders);

  });
};
const checkFolderCreating = () => {
  fs.stat(folderProject, (err) => {
    if (!err) {
      fs.rm(folderProject, { recursive: true },err => {
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
