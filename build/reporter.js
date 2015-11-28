'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var colors = require('colors/safe');

// print all known events on screen

var Reporter = (function () {
    function Reporter(parser, options) {
        _classCallCheck(this, Reporter);

        this.parser = parser;
        this.playerNames = {}; // playerId => name
        this.playerResults = {}; // name => result

        this.parser.on('startup', this.onStartUp.bind(this));
        this.parser.on('mode', this.onMode.bind(this));
        this.parser.on('action_start', this.onActionStart.bind(this));
        this.parser.on('zone_change', this.onZoneChange.bind(this));
        this.parser.on('pos_change', this.onPosChange.bind(this));
        this.parser.on('tag_change', this.onTagChange.bind(this));

        this.report = console.log;
    }

    _createClass(Reporter, [{
        key: 'onStartUp',
        value: function onStartUp() {
            this.report(colors.grey("Hearthstone Started"));
        }
    }, {
        key: 'onMode',
        value: function onMode(mode) {
            var _,
                name = mode;
            this.report(colors.grey("Mode: " + name));
        }
    }, {
        key: 'onActionStart',
        value: function onActionStart(data) {}
    }, {
        key: 'onZoneChange',
        value: function onZoneChange(data) {}
    }, {
        key: 'onPosChange',
        value: function onPosChange(data) {}
    }, {
        key: 'onTagChange',
        value: function onTagChange(data) {
            var type = data.type;
            var name = data.name;
            var state = data.state;

            switch (type) {
                case "game_start":
                    console.log(colors.red("Game Start"));
                    break;
                case "player_id":
                    this.onPlayerId(name, state);
                    break;
                case "first_player":
                    console.log(colors.white(name + " play first."));
                    break;
                case "game_over":
                    console.log(colors.red("Game finished: " + name + " " + state));
                    break;
            }
        }
    }, {
        key: 'onGameOver',
        value: function onGameOver(name, result) {
            this.playerResults[name] = result;
            var players = Object.keys(this.playerResults);
            if (players.length == 2) {
                var message = players[0] + ' ' + this.playerResults[players[0]];
                this.report(colors.white(message));
            }
        }
    }, {
        key: 'onPlayerId',
        value: function onPlayerId(name, playerId) {
            this.playerNames[playerId] = name;
            var names = Object.entries(this.playerNames);
            if (names.length == 2) {
                var message = names.join(" vs ");
                this.report(colors.white(message));
            }
        }
    }]);

    return Reporter;
})();

module.exports = Reporter;