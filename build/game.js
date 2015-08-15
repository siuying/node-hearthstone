'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Player = require('./player');
var slugify = require('underscore.string/slugify');

var Game = (function () {
    function Game() {
        var mode = arguments.length <= 0 || arguments[0] === undefined ? "unknown" : arguments[0];

        _classCallCheck(this, Game);

        this.mode = mode;
        this.players = [];
        this.events = [];
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
                    case "player_id":
                        this.playerWithIdOrName(player_id, name);
                        break;
                    case "first_player":
                        var player = this.playerWithIdOrName(null, name);
                        player.firstPlayer = true;
                        break;
                    case "game_over":
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
            var player = this.players.find(function (p) {
                return id && p.id === id || name && p.name === name;
            });
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
                return p.result;
            }).length == 2;
        }
    }, {
        key: 'filename',
        value: function filename() {
            var firstPlayer = this.players[0];
            var secondPlayer = this.players[1];
            var firstPlayerName = firstPlayer ? firstPlayer.name : "UNKNOWN";
            var secondPlayerName = secondPlayer ? secondPlayer.name : "UNKNOWN";
            var gameStartEvent = this.events.find(function (e) {
                return e[0] == "tag_change" && e[1]['type'] == "game_start";
            });
            var time = gameStartEvent ? gameStartEvent[1]['timestamp'] : new Date().valueOf() / 1000;
            return time + '_' + this.mode + '_' + slugify(firstPlayerName) + '_v_' + slugify(secondPlayerName);
        }
    }, {
        key: 'toObject',
        value: function toObject() {
            var players = this.players.map(function (p) {
                return p.toObject();
            });
            return { mode: this.mode, players: players, events: this.events };
        }
    }]);

    return Game;
})();

module.exports = Game;