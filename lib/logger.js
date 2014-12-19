var lineReader = require('line-reader');

class Logger {
    constructor() {
    }

    logFile(file) {
        var logger = this;
        lineReader.eachLine(file, function(line, last){
            logger.logLine(line);
        });
    }

    logLine(line) {
    }

    currentGame() {
    }
}

module.exports = Logger;