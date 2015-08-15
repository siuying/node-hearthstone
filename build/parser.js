'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;
var Tail = require('file-tail');

var Parser = (function (_EventEmitter) {
    _inherits(Parser, _EventEmitter);

    function Parser() {
        _classCallCheck(this, Parser);

        _get(Object.getPrototypeOf(Parser.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Parser, [{
        key: 'parse',
        value: function parse(file) {
            var parser = this;
            var tail = new Tail.startTailing(file);
            tail.on("line", function (line) {
                parser.parseLine(line);
            });
            tail.on('error', function (data) {
                console.error("error:", data);
            });
        }
    }, {
        key: 'parseLine',
        value: function parseLine(line) {
            var match = null;
            var result = null;

            var initializeEngineVersion = function initializeEngineVersion() {
                if (line.match(/^Initialize engine version/)) {
                    result = ["startup"];
                    return true;
                }
            };

            var beginSpectatorMode = function beginSpectatorMode() {
                if (line.match(/\[Power\] .* Begin Spectating/)) {
                    result = ["begin_spectator_mode"];
                    return true;
                }
            };

            var endSpectatorMode = function endSpectatorMode() {
                if (line.match(/\[Power\] .* End Spectator/)) {
                    result = ["end_spectator_mode"];
                    return true;
                }
            };

            var detectCurrentMode = function detectCurrentMode() {
                var match = line.match(/\[LoadingScreen\] LoadingScreen.OnSceneLoaded\(\) - prevMode=.* currMode=(.*)/);
                if (match) {
                    var mode = match[1];
                    switch (mode) {
                        case "DRAFT":
                            result = ["mode", "arena"];
                            return true;
                        case "TOURNAMENT":
                            result = ["mode", "ranked"];
                            return true;
                        case "ADVENTURE":
                            result = ["mode", "solo"];
                            return true;
                        case "TAVERN_BRAWL":
                            result = ["mode", "brawl"];
                            return true;
                    }
                }
            };

            /*
             * This function tracks tag changes related to damage, attacking, defending, card target, armor, attack, and health
             */
            var detectChangeWithDetails = function detectChangeWithDetails() {
                var match = line.match(/TAG_CHANGE Entity=\[.*id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d)\] tag=(.*) value=(.*)/);
                if (match) {
                    var _match = _slicedToArray(match, 8);

                    var entityId = _match[1];
                    var zone = _match[2];
                    var zonePos = _match[3];
                    var cardId = _match[4];
                    var playerId = _match[5];
                    var type = _match[6];
                    var state = _match[7];

                    result = this.parseTagChange(type, null, state, parseInt(playerId), parseInt(entityId), zone, parseInt(zonePos), cardId);
                    return true;
                }
            };

            /*
             * This function tracks changes in tags related to player id, player number, win state, game start, turn start, and turn number
             */
            var detectTagChange = function detectTagChange() {
                var match = line.match(/TAG_CHANGE Entity=(.*) tag=(.*) value=(.*)/);
                if (match) {
                    var _match2 = _slicedToArray(match, 4);

                    var player = _match2[1];
                    var type = _match2[2];
                    var state = _match2[3];

                    result = this.parseTagChange(type, player, state);
                    return true;
                }
            };

            var detectPlayerZoneChange = function detectPlayerZoneChange() {
                var match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] zone from (.*) -> (.*)/);
                if (match) {
                    var _match3 = _slicedToArray(match, 11);

                    var id = _match3[1];
                    var local = _match3[2];
                    var name = _match3[3];
                    var entityId = _match3[4];
                    var zone = _match3[5];
                    var zonePos = _match3[6];
                    var cardId = _match3[7];
                    var playerId = _match3[8];
                    var fromZone = _match3[9];
                    var toZone = _match3[10];

                    result = this.parseZoneChange(id, local, name, parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone);
                    return true;
                }
            };

            var detectOpponentCardChange = function detectOpponentCardChange() {
                var match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] zone from (.*) -> (.*)/);
                if (match) {
                    var _match4 = _slicedToArray(match, 11);

                    var id = _match4[1];
                    var local = _match4[2];
                    var entityId = _match4[3];
                    var cardId = _match4[4];
                    var type = _match4[5];
                    var zone = _match4[6];
                    var zonePos = _match4[7];
                    var playerId = _match4[8];
                    var fromZone = _match4[9];
                    var toZone = _match4[10];

                    result = this.parseZoneChange(id, local, "", parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), fromZone, toZone);
                    return true;
                }
            };

            var detectPlayerPositionZoneChange = function detectPlayerPositionZoneChange() {
                var match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] pos from (\d*) -> (\d*)/);
                if (match) {
                    var _match5 = _slicedToArray(match, 11);

                    var id = _match5[1];
                    var local = _match5[2];
                    var name = _match5[3];
                    var entityId = _match5[4];
                    var zone = _match5[5];
                    var zonePos = _match5[6];
                    var cardId = _match5[7];
                    var playerId = _match5[8];
                    var fromPos = _match5[9];
                    var toPos = _match5[10];

                    result = this.parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));
                    return true;
                }
            };

            var detectOpponentPositionZoneChange = function detectOpponentPositionZoneChange() {
                var match = line.match(/\[Zone\] ZoneChangeList\.ProcessChanges\(\) - id=(\d*) local=(.*) \[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] pos from (\d*) -> (\d*)/);
                if (match) {
                    var _match6 = _slicedToArray(match, 11);

                    var id = _match6[1];
                    var local = _match6[2];
                    var entityId = _match6[3];
                    var cardId = _match6[4];
                    var type = _match6[5];
                    var zone = _match6[6];
                    var zonePos = _match6[7];
                    var playerId = _match6[8];
                    var fromPos = _match6[9];
                    var toPos = _match6[10];

                    result = this.parsePosChange(parseInt(entityId), zone, parseInt(zonePos), cardId, parseInt(playerId), parseInt(fromPos), parseInt(toPos));
                    return true;
                }
            };

            var detectAttack = function detectAttack() {
                var match = line.match(/ACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] SubType=ATTACK .* Target=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\]/);
                if (match) {
                    var _match7 = _slicedToArray(match, 7);

                    var id = _match7[1];
                    var cardId = _match7[2];
                    var playerId = _match7[3];
                    var targetId = _match7[4];
                    var targetCardId = _match7[5];
                    var targetPlayerId = _match7[6];

                    result = this.parseActionStart("attack", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
                    return true;
                }
            };

            var detectPowerWithTarget = function detectPowerWithTarget() {
                var match = line.match(/ACTION_START Entity=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\] SubType=POWER Index=(.*) Target=\[name=(.*) id=(\d*) zone=(.*) zonePos=(\d*) cardId=(.*) player=(\d*)\]/);
                if (match) {
                    var _match8 = _slicedToArray(match, 14);

                    var name = _match8[1];
                    var id = _match8[2];
                    var zone = _match8[3];
                    var zonePos = _match8[4];
                    var cardId = _match8[5];
                    var playerId = _match8[6];
                    var index = _match8[7];
                    var targetName = _match8[8];
                    var targetId = _match8[9];
                    var targetZone = _match8[10];
                    var targetZonePos = _match8[11];
                    var targetCardId = _match8[12];
                    var targetPlayerId = _match8[13];

                    result = this.parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), targetCardId, parseInt(targetPlayerId));
                    return true;
                }
            };

            var detectPowerWithoutTarget = function detectPowerWithoutTarget() {
                var match = line.match(/ACTION_START Entity=\[id=(\d*) cardId=(.*) type=(.*) zone=(.*) zonePos=(\d*) player=(\d*)\] SubType=POWER Index=(.*) Target=(\d*)/);
                if (match) {
                    var _match9 = _slicedToArray(match, 9);

                    var id = _match9[1];
                    var cardId = _match9[2];
                    var type = _match9[3];
                    var zone = _match9[4];
                    var zonePos = _match9[5];
                    var playerId = _match9[6];
                    var index = _match9[7];
                    var targetId = _match9[8];

                    result = this.parseActionStart("power", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
                    return true;
                }
            };

            var detectPlay = function detectPlay() {
                var match = line.match(/ACTION_START Entity=\[name=.* id=(\d*) .* cardId=(.*) player=(\d)\] SubType=PLAY Index=(.*) Target=(\d*)/);
                if (match) {
                    var _match10 = _slicedToArray(match, 6);

                    var id = _match10[1];
                    var cardId = _match10[2];
                    var playerId = _match10[3];
                    var index = _match10[4];
                    var targetId = _match10[5];

                    result = this.parseActionStart("play", parseInt(id), cardId, parseInt(playerId), parseInt(targetId), null, null);
                    return true;
                }
            };

            switch (true) {
                case initializeEngineVersion.bind(this)():
                    break;
                case beginSpectatorMode.bind(this)():
                    break;
                case endSpectatorMode.bind(this)():
                    break;
                case detectCurrentMode.bind(this)():
                    break;
                case detectChangeWithDetails.bind(this)():
                    break;
                case detectTagChange.bind(this)():
                    break;
                case detectPlayerZoneChange.bind(this)():
                    break;
                case detectOpponentCardChange.bind(this)():
                    break;
                case detectPlayerPositionZoneChange.bind(this)():
                    break;
                case detectOpponentPositionZoneChange.bind(this)():
                    break;
                case detectAttack.bind(this)():
                    break;
                case detectPowerWithTarget.bind(this)():
                    break;
                case detectPowerWithoutTarget.bind(this)():
                    break;
                case detectPlay.bind(this)():
                    break;
            }

            this.emit.apply(this, result);
            return result;
        }
    }, {
        key: 'parseTagChange',
        value: function parseTagChange(type, playerName, state, playerId, entityId, zone, zonePos, cardId) {
            switch (type) {
                case "PLAYER_ID":
                    return ["tag_change", { type: "player_id", name: playerName, player_id: parseInt(state) }];
                case "FIRST_PLAYER":
                    return ["tag_change", { type: "first_player", name: playerName }];
                case "PLAYSTATE":
                    if (state == "WON" || state == "LOST") {
                        return ["tag_change", { type: "game_over", name: playerName, state: state }];
                    }
                    break;
                case "TURN_START":
                    if (playerName == "GameEntity") {
                        return ["tag_change", { type: "game_start", timestamp: parseInt(state) }];
                    } else {
                        return ["tag_change", { type: "turn_start", name: playerName, timestamp: parseInt(state) }];
                    }
                    break;
                case "RESOURCES":
                    return ["tag_change", { type: "resources", name: playerName, resources: parseInt(state) }];
                case "TURN":
                    return ["tag_change", { type: "turn", number: parseInt(state) }];
                case "DAMAGE":
                    return ["tag_change", { type: "damage", id: entityId, player_id: playerId, value: parseInt(state), card_id: cardId }];
                case "ATTACKING":
                    return ["tag_change", { type: "attacking", id: entityId, player_id: playerId, card_id: cardId }];
                case "DEFENDING":
                    return ["tag_change", { type: "defending", id: entityId, player_id: playerId, card_id: cardId }];
                case "CARD_TARGET":
                    return ["tag_change", { type: "card_target", id: entityId, player_id: playerId, target_id: parseInt(state), card_id: cardId }];
                case "ARMOR":
                    return ["tag_change", { type: "armor", id: entityId, armor: parseInt(state) }];
                case "ATK":
                    return ["tag_change", { type: "attack", id: entityId, attack: parseInt(state) }];
                case "HEALTH":
                    return ["tag_change", { type: "health", id: entityId, health: parseInt(state) }];

            }
        }
    }, {
        key: 'parseZoneChange',
        value: function parseZoneChange(id, local, name, entityId, zone, zonePos, cardId, playerId, fromZone, toZone) {
            return ["zone_change", { id: entityId, player_id: playerId, card_id: cardId, from_zone: fromZone, to_zone: toZone }];
        }
    }, {
        key: 'parsePosChange',
        value: function parsePosChange(entityId, zone, zonePos, cardId, playerId, fromPos, toPos) {
            return ["pos_change", { id: entityId, player_id: playerId, card_id: cardId, from_pos: fromPos, to_pos: toPos, zone: zone }];
        }
    }, {
        key: 'parseActionStart',
        value: function parseActionStart(type, sourceId, sourceCardId, sourcePlayerId, targetId, targetCardId, targetPlayerId) {
            var source = { id: sourceId, card_id: sourceCardId, player_id: sourcePlayerId };
            var target = { id: targetId };
            if (targetCardId) {
                target.card_id = targetCardId;
            }
            if (targetCardId) {
                target.player_id = targetPlayerId;
            }
            return ["action_start", { type: type, source: source, target: target }];
        }
    }]);

    return Parser;
})(EventEmitter);

module.exports = Parser;