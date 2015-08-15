var fs = require('fs');
var path = require('path');

var Parser = require('./parser');
var Tail = require('tail').Tail;
var Game = require('./game');

class Logger {
    constructor(parser, outputPath, options) {
        this.parser = parser;
        this.mode = null;
        this.outputPath = outputPath;
        this.game = new Game(null);
        this.options = options;

        var logger = this;
        this.parser.on('mode', function(mode){
            logger.mode = mode;
            logger.game.mode = mode;
        });
        this.parser.on('action_start', function(data){
            logger.game.addEvent(['action_start', data]);
        });
        this.parser.on('zone_change', function(data) {
            logger.game.addEvent(['zone_change', data]);
        });
        this.parser.on('pos_change', function(data) {
            logger.game.addEvent(['pos_change', data]);
        });
        this.parser.on('tag_change', function(data){
            logger.game.addEvent(['tag_change', data]);

            var {type} = data;
            if (type === "game_over") {
                if (logger.game.isCompleted()) {
                    logger.saveGame();
                    logger.startGame();
                }
            }
        });
    }

    startGame() {
        console.log("Start new game");
        this.game = new Game(this.mode);
    }

    addEvent(event, data) {
        if (this.game) {
            this.game.addEvent([event, data]);
        }
    }

    saveGame() {
        if (this.game) {
            var jsonStr = JSON.stringify(this.game.toObject());
            var filename = `${this.game.filename()}.json`;
            var fullpath = path.join(this.outputPath, filename);
            fs.writeFileSync(fullpath, jsonStr);
            console.log(`Saved match: ${filename}`)
        }
    }
}

module.exports = Logger;