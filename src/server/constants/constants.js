const path = require("path")

const LOG_FILE_PATH = path.join(__dirname + "./../../../dist/logs/log.txt");

console.log(LOG_FILE_PATH);

module.exports = {
  LOG_FILE_PATH
}
