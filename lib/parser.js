var EventEmitter = require('events').EventEmitter;
var Tail = require('file-tail');
var Parsers = require('./parsers');

class Parser extends EventEmitter {
    parse(path) {
        for (var parser of Parsers) {
            let fullpath = `${path}${parser.filename}`;
            let tail = new Tail.startTailing(fullpath);
            let parsers = parser.parsers;
            tail.on("line", (line) => {
                this.parseLine(parsers, line);
            });
            tail.on('error', (data) => {
                console.error("error:", data);
            });  
        }
    }

    parseLine(parsers, line) {
        var match = null;
        for (let parser of parsers) {
            var result = parser(line);
            if (result) {
                this.emit.apply(this, result);
                return result;
            }
        }
    }
}

module.exports = Parser;