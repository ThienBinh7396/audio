const { LOG_FILE_PATH } = require("./../constants/constants");
const fs = require("fs");

class Logger {
  saveLogInFile({ content, filePath, flags = "a+", failCallback, successCallback }) {
    fs.open(filePath, flags, (err, fd) => {
      if (err) {
        failCallback(err);
        return;
      }

      fs.appendFile(fd, content, "utf8", (err) => {
        if (err) {
          failCallback(err);
          return;
        }

        successCallback()
      });
    });
  }
}

module.exports = new Logger();
