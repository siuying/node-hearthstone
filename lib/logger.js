var Parser = require('./parser');
var Tail = require('tail').Tail;

class Logger {
    constructor(parser) {
        this.parser = parser;
        this.mode = null;

        var logger = this;
        this.parser.on('mode', function(mode){
            logger.mode = mode;
            logger.startGame();
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
        this.game = new Game(this.mode);
    }

    addEvent(event, data) {
        if (this.game) {
            this.game.addEvent([event, data]);
        }
    }

    saveGame() {
        // todo: save current game
    }
}

module.exports = Logger;