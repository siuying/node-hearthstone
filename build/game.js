'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = require('./player');
var slugify = require('underscore.string/slugify');

var Game = (function () {
    function Game() {
        var mode = arguments.length <= 0 || arguments[0] === undefined ? "unknown" : arguments[0];

        _classCallCheck(this, Game);

        this.mode = mode;
        this.turn = 0;
        this.players = [];
        this.events = [];
        this.currentPlayer = null;
        this.gameStartTime = new Date();
        this.gameEndTime = null;
    }

    _createClass(Game, [{
        key: 'addEvent',
        value: function addEvent(event) {
            var _event = _slicedToArray(event, 2);

            var name = _event[0];
            var data = _event[1];

            if (name == "tag_change") {
                var type = data.type;
                var name = data.name;
                var player_id = data.player_id;
                var state = data.state;

                switch (type) {
                    case "game_start":
                        this.gameStartTime = new Date();
                        return;
                    case "game_over":
                        this.gameEndTime = new Date();
                        return;
                    case "turn":
                        this.turn = state;
                        return;
                    case "current_player":
                        this.currentPlayer = this.playerWithIdOrName(player_id, name);
                        return;
                    case "player_id":
                        this.playerWithIdOrName(player_id, name);
                        break;
                    case "first_player":
                        var player = this.playerWithIdOrName(null, name);
                        player.firstPlayer = true;
                        break;
                    case "playstate":
                        var player = this.playerWithIdOrName(null, name);
                        player.result = state;
                        break;
                    default:
                }
            }

            this.events.push(event);
        }
    }, {
        key: 'playerWithIdOrName',
        value: function playerWithIdOrName(id, name) {
            var player = this.players.filter(function (p) {
                return id && p.id === id || name && p.name === name;
            })[0];
            if (player) {
                if (name) {
                    player.name = name;
                }
                if (id) {
                    player.id = id;
                }
            } else {
                player = new Player(id, name);
                this.players.push(player);
            }
            return player;
        }
    }, {
        key: 'isCompleted',
        value: function isCompleted() {
            return this.players.filter(function (p) {
                return p.result == "WON" || p.result == "LOST" || p.result == "DRAW";
            }).length == 2;
        }
    }, {
        key: 'filename',
        value: function filename() {
            var firstPlayer = this.players[0];
            var secondPlayer = this.players[1];
            var firstPlayerName = firstPlayer ? firstPlayer.name : "UNKNOWN";
            var secondPlayerName = secondPlayer ? secondPlayer.name : "UNKNOWN";
            var gameStartEvent = this.events.filter(function (e) {
                return e[0] == "tag_change" && e[1]['type'] == "game_start";
            })[0];
            var time = this.gameStartTime().valueOf();
            return time + '_' + slugify(firstPlayerName) + '_v_' + slugify(secondPlayerName);
        }
    }, {
        key: 'gameLength',
        value: function gameLength() {
            if (this.gameEndTime && this.gameStartTime) {
                return this.gameEndTime.valueOf() - this.gameStartTime.valueOf();
            } else {
                return null;
            }
        }
    }, {
        key: 'toObject',
        value: function toObject() {
            var players = this.players.map(function (p) {
                return p.toObject();
            });
            return {
                mode: this.mode,
                players: players,
                turn: this.turn,
                events: this.events,
                game_start: this.gameStartTime.valueOf(),
                game_end: this.gameEndTime.valueOf(),
                game_length: this.gameLength()
            };
        }
    }]);

    return Game;
})();

module.exports = Game;