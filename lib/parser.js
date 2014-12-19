var EventEmitter = require('events').EventEmitter;

class Parser extends EventEmitter {
    parseLine(line) {
        var result = null;

        if (line.match(/^Initialize engine version/)) {
            result = ["startup"];

        } else if (line.match(/\[Power\] .* Begin Spectating/)) {
            result = ["begin_spectator_mode"];

        } else if (line.match(/\[Power\] .* End Spectator/)) {
            result = ["end_spectator_mode"];

        }

        this.emit.apply(this, result);
        return result;
    }
}

module.exports = Parser;