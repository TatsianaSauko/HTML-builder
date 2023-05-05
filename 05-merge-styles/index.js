const fs = require('fs');
const path = require('path');
let folderProject = path.join(__dirname, 'project-dist');
let folderStyles = path.join(__dirname, 'styles');
let fileBundle = path.join(folderProject, 'bundle.css');

const init = () => {
  fs.writeFile(fileBundle, '', (err) => {
    if (err) return console.error(err.message);
  });
};

const deleteFile = () => {
  fs.rm(fileBundle, { recursive: true },err => {
    if(err) throw err;
    init();
  });
};

const create = () => {
  fs.access(fileBundle, fs.constants.F_OK, (err) => {
    if (err) {
      init();
    } else {
      deleteFile();
    }
    fs.readFile(fileBundle, (err) => {
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
              fs.writeFile(fileBundle, data, (error) => {
                if (error) return console.error(error.message);
              });
            });
          }
        });
      });
    });
  });
};

create();