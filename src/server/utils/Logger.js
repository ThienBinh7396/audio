const fs = require("fs");

const { LOG_ROOT } = require("../constants/constants");
class Logger {
  constructor() {
    this.checkLogInit();
  }

  checkLogInit() {
    console.log(LOG_ROOT, fs.existsSync(LOG_ROOT))
    if (!fs.existsSync(LOG_ROOT)) {
      fs.mkdirSync(LOG_ROOT);
    }
  }

  saveLogInFile({
    content,
    filePath,
    flags = "a+",
    failCallback,
    successCallback,
  }) {
    fs.appendFile(filePath, content, { flag: flags }, (err) => {
      if (err) {
        console.log("err", err);
        failCallback(err);
        return;
      }

      successCallback();
    });
  }
}

module.exports = new Logger();
