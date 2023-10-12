const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {

  var i = 1;

  const fileStream = fs.createReadStream('../samples/ITI-47_response_raw.xml');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    console.log(`${i} ${line}`);
    i = i+1;
  }

}

processLineByLine();
