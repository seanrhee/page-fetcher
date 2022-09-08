const args = process.argv.slice(2);
const request = require('request');
const fs = require('fs');
const readline = require('readline');

// function to write data into file
const writeToFile = function (args, body) {
  fs.writeFile(args[1], body, err => {
    if (err) { // if directory is not valid, exit program.
      console.log(`${args[1]} is not a valid directory.`)
      return;
    }

    // getting data for file size
    fs.stat(args[1], (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      let size = stats.size;

      // file written successfully
      console.log(`Downloaded ${args[0]} and saved ${size} to ${args[1]}`);
      return;
    })
  })
}

request(args[0], function (error, response, body) {
  let code = (response && response.statusCode);

  // if response code is anything over 400 (error)
  if (code > 399) {
    console.log(`Error: Status Code ${code}`);
    return;
  }

  // if URL is valid
  if (!error) {
    // check if file exists
    fs.access(args[1], (err) => {
      // if it doesn't exist, write to file
      if (err) {
        writeToFile(args, body)
      } else { // if it does exist, ask if user wants to overwrite
        const rl = readline.createInterface(process.stdin, process.stdout);
        rl.question("File exists. Overwrite? (Y/N) >> ", (ans) => { // y/n for overwrite
          if (ans.toUpperCase() === 'Y') {
            rl.close();
            writeToFile(args, body);
          } else if (ans.toUpperCase() === 'N') {
            console.log('Exiting program...');
            rl.close();
            return;
          }
        })
      }
      
    })
  } else { // url is invalid
    console.log("Invalid URL.");
    return;
  }
});

