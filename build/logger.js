'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fs = require('fs');
var path = require('path');

var Parser = require('./parser');
var Tail = require('tail').Tail;
var Game = require('./game');

var Logger = (function () {
    function Logger(parser, outputPath, options) {
        _classCallCheck(this, Logger);

        this.parser = parser;
        this.mode = null;
        this.outputPath = outputPath;
        this.game = new Game(null);
        this.options = options;

        var logger = this;
        this.parser.on('mode', function (mode) {
            logger.mode = mode;
            logger.game.mode = mode;
        });
        this.parser.on('action_start', function (data) {
            logger.game.addEvent(['action_start', data]);
        });
        this.parser.on('zone_change', function (data) {
            logger.game.addEvent(['zone_change', data]);
        });
        this.parser.on('pos_change', function (data) {
            logger.game.addEvent(['pos_change', data]);
        });
        this.parser.on('tag_change', function (data) {
            logger.game.addEvent(['tag_change', data]);

            var type = data.type;

            if (type === "game_over") {
                if (logger.game.isCompleted()) {
                    logger.saveGame();
                    logger.startGame();
                }
            }
        });
    }

    _createClass(Logger, [{
        key: 'startGame',
        value: function startGame() {
            console.log("Start new game");
            this.game = new Game(this.mode);
        }
    }, {
        key: 'addEvent',
        value: function addEvent(event, data) {
            if (this.game) {
                this.game.addEvent([event, data]);
            }
        }
    }, {
        key: 'saveGame',
        value: function saveGame() {
            if (this.game) {
                var jsonStr = JSON.stringify(this.game.toObject());
                var filename = this.game.filename() + '.json';
                var fullpath = path.join(this.outputPath, filename);
                fs.writeFileSync(fullpath, jsonStr);
                console.log('Saved match: ' + filename);
            }
        }
    }]);

    return Logger;
})();

module.exports = Logger;