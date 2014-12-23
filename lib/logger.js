var Parser = require('./parser');
var Tail = require('tail').Tail;

class Logger {
    constructor(parser) {
        this.parser = parser;
        this.mode = null;

        var logger = this;
        this.parser.on('mode', function(mode){
            logger.mode = mode;
        });
        this.parser.on('action_start', function(){
            // handle action
        });
        this.parser.on('zone_change', function(data) {
            // handle zone change
        });
        this.parser.on('pos_change', function(data) {
            // handle zone change
        });
        this.parser.on('tag_change', function(){
            // handle tag change
        });
    }

    currentGame() {
    }
}

module.exports = Logger;