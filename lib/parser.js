var EventEmitter = require('events').EventEmitter;
var Tail = require('file-tail');
var ls = require('ls');

var Power = require('./parsers/Power');
var Zone = require('./parsers/Zone');
var Party = require('./parsers/Party');

class Parser extends EventEmitter {
    parse(path) {
        let parser = this
        let parsers = [Power, Zone, Party];

        if (!path.match(/\/$/)) {
            path = path + "/"
        }

        ls(path + "*.log", function() {
            // find a parser for the file, if found, watch it
            let file = this.file
            let logParser = parsers.filter((f) => { return f.filename == file })[0];
            let fullpath = this.full;
            if (logParser) {
                let tail = new Tail.startTailing(fullpath);
                tail.on("line", function(line) {
                    parser.parseLine(logParser.parsers, line)
                });
                tail.on('error', function(data) {
                    console.error("error:", data);
                });  
            } else {
                console.log("ignore", fullpath)
            }
        })
    }

    parseLine(parsers, line) {
        var match = null;
        for (let parser of parsers) {
            var result = parser.bind(this)(line);
            if (result) {
                this.emit.apply(this, result);
                return result;
            }
        }
    }
}

module.exports = Parser;