const fs = require('fs');
const path = require('path');
let folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if(file.isFile()){
      const filePath = path.join(folderPath, file.name);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        console.log(`${file.name.split('.')[0]} - ${path.extname(file.name).split('.')[1]} - ${stats.size}b`);
      });
    }
  });
});
