const fs = require('fs');
const path = require('path');
const  { stdout, stdin } = require('node:process');
let writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
stdout.write('Enter text\nWhen finished enter "exit" or press Ctrl+C\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    writeFarewellPhrase();
  }
  writeableStream.write(data);
});
const writeFarewellPhrase = () => {
  stdout.write('Goodbye');
  process.exit();
};
process.on('SIGINT', writeFarewellPhrase);
